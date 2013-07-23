require('../index.js');
var webdriver = require('selenium-webdriver');

/**
 * Tests for the WebDriverJS Jasmine-Node Adapter. These tests use
 * WebDriverJS's control flow and promises without setting up the whole
 * webdriver.
 */

var getFakeDriver = function() {
  var flow = webdriver.promise.controlFlow();
  return {
    sleep: function(ms) {
      return flow.timeout(ms);
    },
    setUp: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled('setup done');
      });
    },
    getValueA: function() {
      return flow.execute(function() {
        return webdriver.promise.delayed(500).then(function() {
          return webdriver.promise.fulfilled('a');
        });
      });
    },
    getOtherValueA: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled('a');
      });
    },
    getValueB: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled('b');
      });
    }
  };
};

var fakeDriver = getFakeDriver();

describe('webdriverJS Jasmine adapter plain', function() {
  it('should pass normal synchronous tests', function() {
    expect(true).toBe(true);
  });
});


describe('webdriverJS Jasmine adapter', function() {
  // Shorten this and you should see tests timing out.
  jasmine.getEnv().defaultTimeoutInterval = 2000;

  beforeEach(function() {
    // 'this' should work properly to add matchers.
    this.addMatchers({
      toBeLotsMoreThan: function(expected) {
        return this.actual > expected + 100;
      }
    });
  });

  beforeEach(function() {
    fakeDriver.setUp().then(function(value) {
      console.log('This should print before each test: ' + value);
    });
  });

  it('should pass normal synchronous tests', function() {
    expect(true).toEqual(true);
  });

  it('should compare a promise to a primitive', function() {
    expect(fakeDriver.getValueA()).toEqual('a');
    expect(fakeDriver.getValueB()).toEqual('b');
  });

  it('should wait till the expect to run the flow', function() {
    var promiseA = fakeDriver.getValueA();
    expect(promiseA.isPending()).toBe(true);
    expect(promiseA).toEqual('a');
    expect(promiseA.isPending()).toBe(true);
  })

  it('should compare a promise to a promise', function() {
    expect(fakeDriver.getValueA()).toEqual(fakeDriver.getOtherValueA());
  });

  it('should still allow use of the underlying promise', function() {
    var promiseA = fakeDriver.getValueA();
    promiseA.then(function(value) {
      expect(value).toEqual('a');
    });
  });

  it('should allow scheduling of tasks', function() {
    fakeDriver.sleep(300);
    expect(fakeDriver.getValueB()).toEqual('b');
  })

  // Uncomment to see timeout failures.
  // it('should timeout after 200ms', function() {
  //   expect(fakeDriver.getValueA()).toEqual('a');
  // }, 200);

  // it('should timeout after 300ms', function() {
  //   fakeDriver.sleep(999);
  //   expect(fakeDriver.getValueB()).toEqual('b');
  // }, 300);
});
