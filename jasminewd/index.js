/**
 * Adapts Jasmine-Node tests to work better with WebDriverJS. Borrows
 * heavily from the mocha WebDriverJS adapter at
 * https://code.google.com/p/selenium/source/browse/javascript/node/selenium-webdriver/testing/index.js
 */

var webdriver = require('selenium-webdriver');

var flow = webdriver.promise.controlFlow();

/**
 * Wraps a function so that all passed arguments are ignored.
 * @param {!Function} fn The function to wrap.
 * @return {!Function} The wrapped function.
 */
function seal(fn) {
  return function() {
    fn();
  };
};


/**
 * Wraps a function so it runs inside a webdriver.promise.ControlFlow and
 * waits for the flow to complete before continuing.
 * @param {!Function} globalFn The function to wrap.
 * @return {!Function} The new function.
 */
function wrapInControlFlow(globalFn) {
  return function() {
    switch (arguments.length) {
      case 1:
        globalFn(asyncTestFn(arguments[0]));
        break;

      case 2:
        // The first variable is a description.
        globalFn(arguments[0], asyncTestFn(arguments[1]));
        break;

      case 3:
        // The third variable should be the timeout in ms.
        globalFn(arguments[0], asyncTestFn(arguments[1]), arguments[2]);
        break;

      default:
        throw Error('Invalid # arguments: ' + arguments.length);
    }
  };

  function asyncTestFn(fn) {
    return function(done) {
      flow.execute(function() {
        fn.call(jasmine.getEnv().currentSpec);
      }).then(seal(done), done);
    };
  };
};

global.it = wrapInControlFlow(global.it);
global.iit = wrapInControlFlow(global.iit);
global.beforeEach = wrapInControlFlow(global.beforeEach);
global.afterEach = wrapInControlFlow(global.afterEach);


/**
 * Wrap a Jasmine matcher function so that it can take webdriverJS promises.
 * @param {!Function} matcher The matcher function to wrap.
 * @param {webdriver.promise.Promise} actualPromise The promise which will
 *     resolve to the actual value being tested.
 * @param {boolean} not Whether this is being called with 'not' active.
 */
function wrapMatcher(matcher, actualPromise, not) {
  return function(expected) {
    actualPromise.then(function(actual) {
      if (expected instanceof webdriver.promise.Promise) {
        expected.then(function(exp) {
          if (not) {
            expect(actual).not[matcher](exp)
          } else {
            expect(actual)[matcher](exp);
          }
        });
      } else {
        if (not) {
          expect(actual).not[matcher](expected)
        } else {
          expect(actual)[matcher](expected);
        }
      }
    });
  };
};

/**
 * Return a chained set of matcher functions which will be evaluated
 * after actualPromise is resolved.
 * @param {webdriver.promise.Promise} actualPromise The promise which will
 *     resolve to the acutal value being tested.
 */
function promiseMatchers(actualPromise) {
  var promises = {not: {}};
  var env = jasmine.getEnv();
  var matchersClass = env.currentSpec.matchersClass || env.matchersClass;

  for (matcher in matchersClass.prototype) {
    promises[matcher] = wrapMatcher(matcher, actualPromise, false);
    promises.not[matcher] = wrapMatcher(matcher, actualPromise, true);
  };

  return promises;
};

originalExpect = global.expect;

global.expect = function(actual) {
  if (actual instanceof webdriver.promise.Promise) {
    if (actual instanceof webdriver.WebElement) {
      throw 'expect called with WebElement argment, expected a Promise. ' + 
          'Did you mean to use .getText()?';
    }
    return promiseMatchers(actual);
  } else {
    return originalExpect(actual);
  }
};

/**
 * A Jasmine reporter which does nothing but execute the input function
 * on a timeout failure.
 */
var OnTimeoutReporter = function(fn) {
  this.callback = fn;
};

OnTimeoutReporter.prototype.reportRunnerStarting = function() {};
OnTimeoutReporter.prototype.reportRunnerResults = function() {};
OnTimeoutReporter.prototype.reportSuiteResults = function() {};
OnTimeoutReporter.prototype.reportSpecStarting = function() {};
OnTimeoutReporter.prototype.reportSpecResults = function(spec) {
  if (!spec.results().passed()) {
    var result = spec.results();
    var failureItem = null;

    var items_length = result.getItems().length;
    for (var i = 0; i < items_length; i++) {
      if (result.getItems()[i].passed_ === false) {
        failureItem = result.getItems()[i];

        if (failureItem.toString().match(/timeout/)) {
          this.callback();
        }
      }
    }
  }
};
OnTimeoutReporter.prototype.log = function() {};

// On timeout, the flow should be reset. This will prevent webdriver tasks
// from overflowing into the next test and causing it to fail or timeout
// as well. This is done in the reporter instead of an afterEach block
// to ensure that it runs after any afterEach() blocks with webdriver tasks
// get to complete first.
jasmine.getEnv().addReporter(new OnTimeoutReporter(function() {
  flow.reset();
}));
