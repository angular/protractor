var util = require('util');

var DBG_INITIAL_SUGGESTIONS =
    ['repl', 'c', 'frame', 'scopes', 'scripts', 'source', 'backtrace'];

/**
 * Repl to step through webdriver test code.
 *
 * @param {Client} node debugger client.
 * @constructor
 */
var DebuggerRepl = function(client) {
  this.client = client;
  this.prompt = '>>> ';
};

/**
 * Eval function for processing a single step in repl.
 * Call callback with the result when complete.
 *
 * @public
 * @param {string} cmd
 * @param {function} callback
 */
DebuggerRepl.prototype.stepEval = function(cmd, callback) {
  switch (cmd) {
    case 'c':
      this.printNextStep_(callback);
      this.client.reqContinue(function() {
        // Intentionally blank.
      });
      break;
    case 'repl':
      console.log('Error: using repl from browser.pause() has been removed. ' +
          'Please use browser.enterRepl instead.');
      callback();
      break;
    case 'schedule': 
      this.printControlFlow_(callback);
      break;
    case 'frame':
      this.client.req({command: 'frame'}, function(err, res) {
        console.log(util.inspect(res, {colors: true}));
        callback();
      });
      break;
    case 'scopes':
      this.client.req({command: 'scopes'}, function(err, res) {
        console.log(util.inspect(res, {depth: 4, colors: true}));
        callback();
      });
      break;
    case 'scripts':
      this.client.req({command: 'scripts'}, function(err, res) {
        console.log(util.inspect(res, {depth: 4, colors: true}));
        callback();
      });
      break;
    case 'source':
      this.client.req({command: 'source'}, function(err, res) {
        console.log(util.inspect(res, {depth: 4, colors: true}));
        callback();
      });
      break;
    case 'backtrace':
      this.client.req({command: 'backtrace'}, function(err, res) {
        console.log(util.inspect(res, {depth: 4, colors: true}));
        callback();
      });
      break;
    default:
      console.log('Unrecognized command.');
      callback();
      break;
  }
};

/**
 * Autocomplete user entries.
 * Call callback with the suggestions.
 *
 * @public
 * @param {string} line Initial user entry
 * @param {function} callback
 */
DebuggerRepl.prototype.complete = function(line, callback) {  
  var suggestions = DBG_INITIAL_SUGGESTIONS.filter(function(suggestion) {
    return suggestion.indexOf(line) === 0;
  });
  console.log('suggestions');
  callback(null, [suggestions, line]);
};

/**
 * Print the next command and setup the next breakpoint.
 *
 * @private
 * @param {function} callback
 */
DebuggerRepl.prototype.printNextStep_ = function(callback) {
  var self = this;
  var onBreak_ = function() {
    self.client.req({
      command: 'evaluate',
      arguments: {
        frame: 0,
        maxStringLength: 1000,
        expression: 'command.getName()'
      }
    }, function(err, res) {
      // We ignore errors here because we'll get one from the initial break.
      if (res.value) {
        console.log('-- Next command: ' + res.value);
      }
      callback();
    });
  };
  this.client.once('break', onBreak_);
};

/**
 * Print the controlflow.
 *
 * @private
 * @param {function} callback
 */
DebuggerRepl.prototype.printControlFlow_ = function(callback) {
  this.client.req({
    command: 'evaluate',
    arguments: {
      frame: 0,
      maxStringLength: 4000,
      expression: 'protractor.promise.controlFlow().getSchedule()'
    }
  }, function(err, controlFlowResponse) {
    if (controlFlowResponse.value) {
      console.log(controlFlowResponse.value);
    }
    callback();
  });
};

module.exports = DebuggerRepl;
