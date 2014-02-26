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
    controlFlow: function() {
      return flow;
    },
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
    },
    getBigNumber: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled(1111);
      });
    },
    getDecimalNumber: function() {
        return flow.execute(function() {
          return webdriver.promise.fulfilled(3.14159);
        });
      },
    getDisplayedElement: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled({
          isDisplayed: function() {
            return webdriver.promise.fulfilled(true);
          }
        });
      });
    },
    getHiddenElement: function() {
      return flow.execute(function() {
        return webdriver.promise.fulfilled({
          isDisplayed: function() {
            return webdriver.promise.fulfilled(false);
          }
        });
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
      },
      // Example custom matcher returning a promise that resolves to true/false.
      toBeDisplayed: function() {
        return this.actual.isDisplayed();
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
  });

  it('should allow the use of custom matchers', function() {
    expect(500).toBeLotsMoreThan(3);
    expect(fakeDriver.getBigNumber()).toBeLotsMoreThan(33);
  });

  it('should allow custom matchers to return a promise', function() {
    expect(fakeDriver.getDisplayedElement()).toBeDisplayed();
    expect(fakeDriver.getHiddenElement()).not.toBeDisplayed();
  });

  it('should pass multiple arguments to matcher', function() {
      // Passing specific precision
      expect(fakeDriver.getDecimalNumber()).toBeCloseTo(3.1, 1);
      expect(fakeDriver.getDecimalNumber()).not.toBeCloseTo(3.1, 2);

      // Using default precision (2)
      expect(fakeDriver.getDecimalNumber()).not.toBeCloseTo(3.1);
      expect(fakeDriver.getDecimalNumber()).toBeCloseTo(3.14);
    });

  describe('not', function() {
    it('should still pass normal synchronous tests', function() {
      expect(4).not.toEqual(5);
    });

    it('should compare a promise to a primitive', function() {
      expect(fakeDriver.getValueA()).not.toEqual('b');
    });

    it('should compare a promise to a promise', function() {
      expect(fakeDriver.getValueA()).not.toEqual(fakeDriver.getValueB());
    });
  });

  it('should throw an error with a WebElement actual value', function() {
    var webElement = new webdriver.WebElement(fakeDriver, 'idstring');

    expect(function() {
      expect(webElement).toEqual(4);
    }).toThrow('expect called with WebElement argment, expected a Promise. ' +
        'Did you mean to use .getText()?');
  });

  // Uncomment to see timeout failures.
  // it('should timeout after 200ms', function() {
  //   expect(fakeDriver.getValueA()).toEqual('a');
  // }, 200);

  // it('should timeout after 300ms', function() {
  //   fakeDriver.sleep(9999);
  //   expect(fakeDriver.getValueB()).toEqual('b');
  // }, 300);

  it('should pass after the timed out tests', function() {
    expect(true).toEqual(true);
  });
});
