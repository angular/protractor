var REPL_INITIAL_SUGGESTIONS = [
  'element(by.id(\'\'))',
  'element(by.css(\'\'))',
  'element(by.name(\'\'))',
  'element(by.binding(\'\'))',
  'element(by.xpath(\'\'))',
  'element(by.tagName(\'\'))',
  'element(by.className(\'\'))'
];

/**
 * Repl to interactively run code.
 *
 * @param {Client} node debugger client.
 * @constructor
 */
var CommandRepl = function(client) {
  this.client = client;
  this.prompt = '> ';
};

/**
 * Eval function for processing a single step in repl.
 * Call callback with the result when complete.
 *
 * @public
 * @param {string} expression
 * @param {function} callback
 */
CommandRepl.prototype.stepEval = function(expression, callback) {
  expression = expression.replace(/"/g, '\\\"');
  var expr = 'browser.dbgCodeExecutor_.execute("' + expression + '")';
  this.evaluate_(expr, function(err, res) {
    // Result is a string representation of the evaluation.
    if (res !== undefined) {
      console.log(res);
    }
    callback(err, undefined);
  });
};

/**
 * Autocomplete user entries.
 * Call callback with the suggestions.
 *
 * @public
 * @param {string} line Initial user entry
 * @param {function} callback
 */
CommandRepl.prototype.complete = function(line, callback) {
  if (line === '') {
    callback(null, [REPL_INITIAL_SUGGESTIONS, '']);
  } else {
    line = line.replace(/"/g, '\\\"');
    var expr = 'browser.dbgCodeExecutor_.complete("' + line + '")';
    this.evaluate_(expr, function(err, res) {
      // Result is a JSON representation of the autocomplete response. 
      var result = res === undefined ? undefined : JSON.parse(res);
      callback(err, result);
    });
  }
};

/**
 * Helper function to evaluate an expression remotely, and callback with
 * the result. The expression can be a promise, in which case, the method
 * will wait for the result and callback with the resolved value.
 *
 * @private
 * @param {string} expression Expression to evaluate
 * @param {function} callback
 */
CommandRepl.prototype.evaluate_ = function(expression, callback) {
  var self = this;
  var onbreak_ = function() {
    self.client.req({
      command: 'evaluate',
      arguments: {
        frame: 0,
        maxStringLength: 1000,
        expression: 'browser.dbgCodeExecutor_.resultReady()'
      }
    }, function(err, res) {
      // If code finished executing, get result.
      if (res.value) {
        self.client.req({
          command: 'evaluate',
          arguments: {
            frame: 0,
            maxStringLength: -1,
            expression: 'browser.dbgCodeExecutor_.getResult()'
          }
        }, function(err, res) {
          try {
            callback(err, res.value);
          } catch (e) {
            callback(e, undefined);
          }
          self.client.removeListener('break', onbreak_);
        });
      } else {
        // If we need more loops for the code to finish executing, continue
        // until the next execute step.
        self.client.reqContinue(function() {
          // Intentionally blank.
        });
      }
    });
  };

  this.client.on('break', onbreak_);

  this.client.req({
    command: 'evaluate',
    arguments: {
      frame: 0,
      maxStringLength: 1000,
      expression: expression
    }
  }, function() {
    self.client.reqContinue(function() {
      // Intentionally blank.
    });
  });
};

module.exports = CommandRepl;
