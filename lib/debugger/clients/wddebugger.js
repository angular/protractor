var repl = require('repl');
var debuggerCommons = require('../debuggerCommons');
var DebuggerRepl = require('../modes/debuggerRepl');

/**
 * Custom protractor debugger which steps through one control flow task at a time.
 *
 * @constructor
 */
var WdDebugger = function() {
  this.client;
  this.replServer;
  this.dbgRepl;
};

/**
 * Eval function for processing a single step in repl.
 * @private
 * @param {string} cmd
 * @param {object} context
 * @param {string} filename
 * @param {function} callback
 */
WdDebugger.prototype.stepEval_ = function(cmd, context, filename, callback) {
  // The loop won't come back until 'callback' is called.
  // Note - node's debugger gets around this by adding custom objects
  // named 'c', 's', etc to the REPL context. They have getters which
  // perform the desired function, and the callback is stored for later use.
  // Think about whether this is a better pattern.

  cmd = debuggerCommons.trimReplCmd(cmd);
  this.dbgRepl.stepEval(cmd, callback);
};

/**
 * Instantiate all repl objects, and debuggerRepl as current and start repl.
 * @private
 */
WdDebugger.prototype.initRepl_ = function() {
  var self = this;
  this.dbgRepl = new DebuggerRepl(this.client);

  // We want the prompt to show up only after the controlflow text prints.
  this.dbgRepl.printControlFlow_(function() {
    self.replServer = repl.start({
      prompt: self.dbgRepl.prompt,
      input: process.stdin,
      output: process.stdout,
      eval: self.stepEval_.bind(self),
      useGlobal: false,
      ignoreUndefined: true,
      completer: self.dbgRepl.complete.bind(self.dbgRepl)
    });

    self.replServer.on('exit', function() {
      console.log('Resuming code execution');
      self.client.req({command: 'disconnect'}, function() {
        process.exit();
      });
    });
  });
};

/**
 * Initiate the debugger.
 * @public
 */
WdDebugger.prototype.init = function() {
  var self = this;
  this.client = debuggerCommons.attachDebugger(process.argv[2], process.argv[3]);
  this.client.once('ready', function() {
    debuggerCommons.setWebDriverCommandBreakpoint(self.client, function() {
      process.send('ready');
      self.client.reqContinue(function() {
        // Intentionally blank.
      });
    });
    self.initRepl_();
  });
};

var wdDebugger = new WdDebugger();
wdDebugger.init();
