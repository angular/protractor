var repl = require('repl');
var debuggerCommons = require('../debuggerCommons');
var CommandRepl = require('../modes/commandRepl');

/**
 * BETA BETA BETA
 * Custom explorer to test protractor commands.
 *
 * @constructor
 */
var WdRepl = function() {
  this.client;
};

/**
 * Instantiate a server to handle IO.
 * @param {number} port The port to start the server.
 * @private
 */
WdRepl.prototype.initServer_ = function(port) {
  var net = require('net');
  var self = this;
  var cmdRepl = new CommandRepl(this.client);

  var received = '';
  net.createServer(function(sock) {
    sock.on('data', function(data) {
      received += data.toString();
      var eolIndex = received.indexOf('\r\n');
      if (eolIndex === 0) {
        return;
      }
      var input = received.substring(0, eolIndex);
      received = received.substring(eolIndex + 2);
      if (data[0] === 0x1D) {
        // '^]': term command
        self.client.req({command: 'disconnect'}, function() {
          // Intentionally blank.
        });
        sock.end();
        // TODO(juliemr): Investigate why this is necessary. At this point, there
        // should be no active listeners so this process should just exit
        // by itself.
        process.exit(0);
      } else if (input[input.length - 1] === '\t') {
        // If the last character is the TAB key, this is an autocomplete
        // request. We use everything before the TAB as the init data to feed
        // into autocomplete.
        input = input.substring(0, input.length - 1);
        cmdRepl.complete(input, function(err, res) {
          if (err) {
            sock.write('ERROR: ' + err + '\r\n');
          } else {
            sock.write(JSON.stringify(res) + '\r\n');
          }
        });
      } else {
        // Normal input
        input = input.trim();
        cmdRepl.stepEval(input, function(err, res) {
          if (err) {
            sock.write('ERROR: ' + err + '\r\n');
            return;
          }
          if (res === undefined) {
            res = '';
          }
          sock.write(res + '\r\n');
        });
      }
    });
  }).listen(port);

  console.log('Server listening on 127.0.0.1:' + port);
};

/**
 * Instantiate a repl to handle IO.
 * @private
 */
WdRepl.prototype.initRepl_ = function() {
  var self = this;
  var cmdRepl = new CommandRepl(this.client);

  // Eval function for processing a single step in repl.
  var stepEval = function(cmd, context, filename, callback) {
    // The command that eval feeds is of the form '(CMD\n)', so we trim the
    // double quotes and new line. 
    cmd = debuggerCommons.trimReplCmd(cmd);
    cmdRepl.stepEval(cmd, function(err, res) {
      // Result is a string representation of the evaluation.
      if (res !== undefined) {
        console.log(res);
      }
      callback(err, undefined);
    });
  };

  var replServer = repl.start({
    prompt: cmdRepl.prompt,
    input: process.stdin,
    output: process.stdout,
    eval: stepEval,
    useGlobal: false,
    ignoreUndefined: true,
    completer: cmdRepl.complete.bind(cmdRepl)
  });

  replServer.on('exit', function() {
    console.log('Element Explorer Exiting...');
    self.client.req({command: 'disconnect'}, function() {
      // TODO(juliemr): Investigate why this is necessary. At this point, there
      // should be no active listeners so this process should just exit
      // by itself.
      process.exit(0);
    });
  });
};

/**
 * Instantiate a repl or a server.
 * @private
 */
WdRepl.prototype.initReplOrServer_ = function() {
  // Note instead of starting either repl or server, another approach is to 
  // feed the server socket into the repl as the input/output streams. The 
  // advantage is that the process becomes much more realistic because now we're
  // using the normal repl. However, it was not possible to test autocomplete 
  // this way since we cannot immitate the TAB key over the wire. 
  var debuggerServerPort = process.argv[4];
  if (debuggerServerPort) {
    this.initServer_(debuggerServerPort);
  } else {
    this.initRepl_();
  }
};

/**
 * Initiate the debugger.
 * @public
 */
WdRepl.prototype.init = function() {
  var self = this;
  this.client = debuggerCommons.attachDebugger(process.argv[2], process.argv[3]);
  this.client.once('ready', function() {
    debuggerCommons.setEvaluateBreakpoint(self.client, function() {
      process.send('ready');
      self.client.reqContinue(function() {
        // Intentionally blank.
      });
    });
    self.initReplOrServer_();
  });
};

var wdRepl = new WdRepl();
wdRepl.init();
