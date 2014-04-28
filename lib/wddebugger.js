console.log('------- WebDriver Debugger -------');

var util = require('util');
var repl = require('repl');
/**
 * BETA BETA BETA
 * Custom protractor debugger which steps through one control flow task
 * at a time.
 */

// Leave in err, res function parameters.
// jshint unused: false
var baseDebugger = require('_debugger');

var client = new baseDebugger.Client();

var host = 'localhost';
var port = 5858;

var debuggerRepl;

var resumeReplCallback = null;
var resume = function() {
  if (resumeReplCallback) {
    resumeReplCallback();
  }
  resumeReplCallback = null;
};


var debugStepperEval = function(cmd, context, filename, callback) {
  // The loop won't come back until 'callback' is called.
  // Strip out the () which the REPL adds and the new line.
  // Note - node's debugger gets around this by adding custom objects
  // named 'c', 's', etc to the REPL context. They have getters which
  // perform the desired function, and the callback is stored for later use.
  // Think about whether this is a better pattern.
  cmd = cmd.slice(1, cmd.length - 2);
  switch (cmd) {
    case 'c':
      resumeReplCallback = callback;
      client.reqContinue(function(err, res) {
        // Intentionally blank.
      });
      break;
    case 'frame':
      client.req({command: 'frame'}, function(err, res) {
        console.log('frame response: ' + util.inspect(res));
        callback(null, 1);
      });
      break;
    case 'scopes':
      client.req({command: 'scopes'}, function(err, res) {
        console.log('scopes response: ' + util.inspect(res, {depth: 4}));
        callback(null, 1);
      });
      break;
    case 'scripts':
      client.req({command: 'scripts'}, function(err, res) {
        console.log('scripts response: ' + util.inspect(res, {depth: 4}));
        callback(null, 1);
      });
      break;
    case 'source':
      client.req({command: 'source'}, function(err, res) {
        console.log('source response: ' + util.inspect(res, {depth: 4}));
        callback(null, 1);
      });
      break;
    case 'backtrace':
      client.req({command: 'backtrace'}, function(err, res) {
        console.log('backtrace response: ' + util.inspect(res, {depth: 4}));
        callback(null, 1);
      });
      break;
    case 'd':
      client.req({command: 'disconnect'}, function(err, res) {});
      callback(null, 1);
      break;
    default:
      console.log('Unrecognized command.');
      callback(null, undefined);
      break;
  }
};

var replOpts = {
  prompt: 'wd-debug> ',
  input: process.stdin,
  output: process.stdout,
  eval: debugStepperEval,
  useGlobal: false,
  ignoreUndefined: true
};

var initializeRepl = function() {
  debuggerRepl = repl.start(replOpts);

  debuggerRepl.on('exit', function() {
    process.exit(0);
  });
};

client.once('ready', function() {
  console.log(' ready\n');

  client.setBreakpoint({
        type: 'scriptRegExp',
        target: 'selenium-webdriver/executors.js',
        line: 37
      },
      function(err, res) {
        console.log('press c to continue to the next webdriver command');
        console.log('press d to continue to the next debugger statement');
        console.log('press ^C to exit');
      });
});

// TODO - might want to add retries here.
client.connect(port, host);

client.on('break', function(res) {
  client.req({
    command: 'evaluate',
    arguments: {
      frame: 0,
      maxStringLength: 2000,
      expression: 'protractor.promise.controlFlow().getControlFlowText()'
    }
  }, function(err, controlFlowResponse) {
    if (!err) {
      client.req({
        command: 'evaluate',
        arguments: {
          frame: 0,
          maxStringLength: 1000,
          expression: 'command.getName()'
        }
      }, function (err, response) {
        if (response.value) {
          console.log('-- Next command: ' + response.value);
        }
        console.log(controlFlowResponse.value);
        if (!debuggerRepl) {
          initializeRepl();
        }
        resume();
      });
    }
  });
});

