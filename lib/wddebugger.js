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

if (process.argv[2]) {
  port = process.argv[2];
}

var REPL_INITIAL_SUGGESTIONS = [
  'element(by.id(\'\'))',
  'element(by.css(\'\'))',
  'element(by.name(\'\'))',
  'element(by.binding(\'\'))',
  'element(by.xpath(\'\'))',
  'element(by.tagName(\'\'))',
  'element(by.className(\'\'))'
];

var DBG_INITIAL_SUGGESTIONS = 
    ['repl', 'c', 'frame', 'scopes', 'scripts', 'source', 'backtrace', 'd'];

var debuggerRepl; 

// repl is broken into a 'command repl loop' and a 'debugger repl loop'.
// This flag indicate which loop it is in to process the commands appropriately.
var cmdReplLoop = false;

// This helper function allows us to go to the next step in the repl on the
// `on('break')`.
var resumeReplCallback = null;
var resume = function(err, res) {
  if (resumeReplCallback) {
    resumeReplCallback(err, res);
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

  if (cmdReplLoop) {
    if (cmd === 'exit') {
      cmdReplLoop = false;
      debuggerRepl.prompt = 'wd-debug> ';
      callback(undefined, undefined);
    } else {
      cmd = cmd.replace(/"/g, '\\\"');
      client.req({
        command: 'evaluate',
        arguments: {
          frame: 0,
          maxStringLength: 1000,
          expression: 'browser.dbgCodeExecutor_.execute("' + cmd + '")'
        }
      }, function(err, res) {
        resumeReplCallback = callback;
        client.reqContinue(function(err, res) {
          // Intentionally blank.
        });
      });
    }
  } else {
    switch (cmd) {
      case 'repl': 
        cmdReplLoop = true;
        debuggerRepl.prompt = '> ';
        console.log('type "exit" to break out of repl mode');
        callback(undefined, undefined);
        break;
      case 'c':
        resumeReplCallback = callback;
        client.reqContinue(function(err, res) {
          // Intentionally blank.
        });
        break;
      case 'frame':
        client.req({command: 'frame'}, function(err, res) {
          console.log(util.inspect(res, {colors: true}));
          callback(null, undefined);
        });
        break;
      case 'scopes':
        client.req({command: 'scopes'}, function(err, res) {
          console.log(util.inspect(res, {depth: 4, colors: true}));
          callback(null, undefined);
        });
        break;
      case 'scripts':
        client.req({command: 'scripts'}, function(err, res) {
          console.log(util.inspect(res, {depth: 4, colors: true}));
          callback(null, undefined);
        });
        break;
      case 'source':
        client.req({command: 'source'}, function(err, res) {
          console.log(util.inspect(res, {depth: 4, colors: true}));
          callback(null, undefined);
        });
        break;
      case 'backtrace':
        client.req({command: 'backtrace'}, function(err, res) {
          console.log(util.inspect(res, {depth: 4, colors: true}));
          callback(null, undefined);
        });
        break;
      case 'd':
        client.req({command: 'disconnect'}, function(err, res) {
          // Intentionally blank.
        });
        break;
      default:
        console.log('Unrecognized command.');
        callback(null, undefined);
        break;
    }
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

  debuggerRepl.complete = function(line, completeCallback) {
    if (cmdReplLoop) {
      if (line === '') {
        completeCallback(null, [REPL_INITIAL_SUGGESTIONS, '']);
      } else {
        line = line.replace(/"/g, '\\\"');
        client.req({
          command: 'evaluate',
          arguments: {
            frame: 0,
            maxStringLength: 1000,
            expression: 'browser.dbgCodeExecutor_.complete("' + line + '")'
          }
        }, function(err, res) {
          resumeReplCallback = completeCallback;
          client.reqContinue(function(err, res) {
            // Intentionally blank.
          });
        });
      }
    } else {
      var suggestions = DBG_INITIAL_SUGGESTIONS.filter(function(suggestion) {
        return suggestion.indexOf(line) === 0;
      });
      completeCallback(null, [suggestions, line]);
    }
  };


  debuggerRepl.on('exit', function() {
    console.log('Exiting debugger.');
    client.req({command: 'disconnect'}, function(err, res) {
      // Intentionally blank.
    });
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
        console.log('type "repl" to enter interactive mode');
        console.log('press ^C to exit');
        console.log();
      });
});

// TODO - might want to add retries here.
client.connect(port, host);

client.on('break', function(res) {
  if (cmdReplLoop) {
    client.req({
      command: 'evaluate',
      arguments: {
        frame: 0,
        maxStringLength: 1000,
        expression: 'browser.dbgCodeExecutor_.resultReady()'
      }
    }, function(err, res) {
      // If code finished executing, get result.
      if (res.value) {
        client.req({
          command: 'evaluate',
          arguments: {
            frame: 0,
            maxStringLength: 2000,
            expression: 'browser.dbgCodeExecutor_.getResult()'
          }
        }, function(err, res) {
          if (!debuggerRepl) {
            initializeRepl();
          }
          try {
            var result = res.value === undefined ? 
                undefined : JSON.parse(res.value);
            resume(err, result);
          } catch(e) {
            resume(e, null);
          }
          
        });
      } else {
        // If we need more loops for the code to finish executing, continue
        // until the next execute step. 
        client.reqContinue(function(err, res) {
          // Intentionally blank.
        });
      }
    });
  } else {
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
        }, function(err, res) {
          if (res.value) {
            console.log('-- Next command: ' + res.value);
          }
          console.log(controlFlowResponse.value);
          if (!debuggerRepl) {
            initializeRepl();
          }
          resume(undefined, undefined);
        });
      }
    });
  }
});
