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
global.beforeEach = wrapInControlFlow(global.beforeEach);
global.afterEach = wrapInControlFlow(global.afterEach);


/**
 * Wrap a Jasmine matcher function so that it can take webdriverJS promises.
 * @param {!Function} matcher The matcher function to wrap.
 * @param {webdriver.promise.Promise} actualPromise The promise which will
 *     resolve to the actual value being tested.
 */
function wrapMatcher(matcher, actualPromise) {
  return function(expected) {
    actualPromise.then(function(actual) {
      if (expected instanceof webdriver.promise.Promise) {
        expected.then(function(exp) {
          expect(actual)[matcher](exp);
        });
      } else {
        expect(actual)[matcher](expected);
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
  var promises = {};
  for (matcher in jasmine.Matchers.prototype) {
    promises[matcher] = wrapMatcher(matcher, actualPromise);
  };

  return promises;
};

originalExpect = global.expect;

global.expect = function(actual) {
  if (actual instanceof webdriver.promise.Promise) {
    return promiseMatchers(actual);
  } else {
    return originalExpect(actual);
  }
};
