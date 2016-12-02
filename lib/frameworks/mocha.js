var q = require('q');
var promise = require('selenium-webdriver').promise;

/**
 * Execute the Runner's test cases through Mocha.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs) {
  var Mocha = require('mocha'),
      mocha = new Mocha(runner.getConfig().mochaOpts);

  var deferred = q.defer();

  // Mocha doesn't set up the ui until the pre-require event, so
  // wait until then to load mocha-webdriver adapters as well.
  mocha.suite.on('pre-require', function() {
    try {
      global.after = wrapped(global.after);
      global.afterEach = wrapped(global.afterEach);
      global.before = wrapped(global.before);
      global.beforeEach = wrapped(global.beforeEach);

      global.it = wrapped(global.it);
      global.it.only = wrapped(global.iit);
      global.it.skip = wrapped(global.xit);
    } catch (err) {
      deferred.reject(err);
    }
  });

  mocha.loadFiles();

  runner.runTestPreparer().then(function() {
    specs.forEach(function(file) {
      mocha.addFile(file);
    });

    var testResult = [];

    var mochaRunner = mocha.run(function(failures) {
      try {
        var completed = q();
        if (runner.getConfig().onComplete) {
          completed = q(runner.getConfig().onComplete());
        }
        completed.then(function() {
          deferred.resolve({
            failedCount: failures,
            specResults: testResult
          });
        });
      } catch (err) {
        deferred.reject(err);
      }
    });

    mochaRunner.on('pass', function(test) {
      var testInfo = {
        name: test.title,
        category: test.fullTitle().slice(0, -test.title.length).trim()
      };
      runner.emit('testPass', testInfo);
      testResult.push({
        description: test.title,
        assertions: [{
          passed: true
        }],
        duration: test.duration
      });
    });

    mochaRunner.on('fail', function(test) {
      var testInfo = {
        name: test.title,
        category: test.fullTitle().slice(0, -test.title.length).trim()
      };
      runner.emit('testFail', testInfo);
      testResult.push({
        description: test.title,
        assertions: [{
          passed: false,
          errorMsg: test.err.message,
          stackTrace: test.err.stack
        }],
        duration: test.duration
      });
    });
  }).catch (function(reason) {
      deferred.reject(reason);
  });

  return deferred.promise;
};



var flow = (function() {
  var initial = process.env['SELENIUM_PROMISE_MANAGER'];
  try {
    process.env['SELENIUM_PROMISE_MANAGER'] = '1';
    return promise.controlFlow();
  } finally {
    if (initial === undefined) {
      delete process.env['SELENIUM_PROMISE_MANAGER'];
    } else {
      process.env['SELENIUM_PROMISE_MANAGER'] = initial;
    }
  }
})();

/**
 * Wraps a function on Mocha's BDD interface so it runs inside a
 * webdriver.promise.ControlFlow and waits for the flow to complete before
 * continuing.
 * @param {!Function} globalFn The function to wrap.
 * @return {!Function} The new function.
 */
function wrapped(globalFn) {
  return function() {
    if (arguments.length === 1) {
      return globalFn(makeAsyncTestFn(arguments[0]));

    } else if (arguments.length === 2) {
      return globalFn(arguments[0], makeAsyncTestFn(arguments[1]));

    } else {
      throw Error('Invalid # arguments: ' + arguments.length);
    }
  };
}

/**
 * Wraps a function so that all passed arguments are ignored.
 * @param {!Function} fn The function to wrap.
 * @return {!Function} The wrapped function.
 */
function seal(fn) {
  return function() {
    fn();
  };
}

/**
 * Make a wrapper to invoke caller's test function, fn.  Run the test function
 * within a ControlFlow.
 *
 * Should preserve the semantics of Mocha's Runnable.prototype.run (See
 * https://github.com/mochajs/mocha/blob/master/lib/runnable.js#L192)
 *
 * @param {!Function} fn
 * @return {!Function}
 */
function makeAsyncTestFn(fn) {
  var isAsync = fn.length > 0;
  var isGenerator = promise.isGenerator(fn);
  if (isAsync && isGenerator) {
    throw new TypeError(
        'generator-based tests must not take a callback; for async testing,'
            + ' return a promise (or yield on a promise)');
  }

  var ret = /** @type {function(this: mocha.Context)}*/ function(done) {
    var self = this;
    var runTest = function(resolve, reject) {
      try {
        if (self.isAsync) {
          fn.call(self, function(err) { err ? reject(err) : resolve(); });
        } else if (self.isGenerator) {
          resolve(promise.consume(fn, self));
        } else {
          resolve(fn.call(self));
        }
      } catch (ex) {
        reject(ex);
      }
    };

    if (!promise.USE_PROMISE_MANAGER) {
      new promise.Promise(runTest).then(seal(done), done);
      return;
    }

    var runnable = this.runnable();
    var mochaCallback = runnable.callback;
    runnable.callback = function() {
      flow.reset();
      return mochaCallback.apply(this, arguments);
    };

    flow.execute(function controlFlowExecute() {
      return new promise.Promise(function(fulfill, reject) {
        return runTest(fulfill, reject);
      }, flow);
    }, runnable.fullTitle()).then(seal(done), done);
  };

  ret.toString = function() {
    return fn.toString();
  };

  return ret;
}
