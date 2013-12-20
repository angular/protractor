var url = require('url');
var util = require('util');
var path = require('path');
var webdriver = require('selenium-webdriver');

var clientSideScripts = require('./clientsidescripts.js');
var ProtractorBy = require('./locators.js').ProtractorBy;

var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';

var WEB_ELEMENT_FUNCTIONS = [
  'click', 'sendKeys', 'getTagName', 'getCssValue', 'getAttribute', 'getText',
  'getSize', 'getLocation', 'isEnabled', 'isSelected', 'submit', 'clear',
  'isDisplayed', 'getOuterHtml', 'getInnerHtml'];

/**
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (foo in webdriver) {
  exports[foo] = webdriver[foo];
}

/**
 * @type {ProtractorBy}
 */
exports.By = new ProtractorBy();

/**
 * Mix a function from one object onto another. The function will still be
 * called in the context of the original object.
 *
 * @private
 * @param {Object} to
 * @param {Object} from
 * @param {string} fnName
 * @param {function=} setupFn
 */
var mixin = function(to, from, fnName, setupFn) {
  to[fnName] = function() {
    if (setupFn) {
      setupFn();
    }
    return from[fnName].apply(from, arguments);
  };
};

/**
 * Build the helper 'element' function for a given instance of Protractor.
 *
 * @private
 * @param {Protractor} ptor
 * @return {function(webdriver.Locator): ElementFinder}
 */
var buildElementHelper = function(ptor) {
  var element = function(locator) {
    var elementFinder = {};
    var webElementFns = WEB_ELEMENT_FUNCTIONS.concat(
        ['findElements', 'isElementPresent', 'evaluate', '$$']);
    webElementFns.forEach(function(fnName) {
      elementFinder[fnName] = function() {
        var args = arguments;
        return ptor.findElement(locator).then(function(element) {
          return element[fnName].apply(element, args);
        }, function(error) {
          throw error;
        });
      };
    });

    // This is a special case since it doesn't return a promise, instead it
    // returns a WebElement.
    elementFinder.findElement = function(subLocator) {
      return ptor.findElement(locator).findElement(subLocator);
    };

    // This is a special case since it doesn't return a promise, instead it
    // returns a WebElement.
    elementFinder.$ = function(cssSelector) {
      return ptor.findElement(locator).
          findElement(webdriver.By.css(cssSelector));
    };

    elementFinder.find = function() {
      return ptor.findElement(locator);
    };

    elementFinder.isPresent = function() {
      return ptor.isElementPresent(locator);
    };

    return elementFinder;
  };

  /**
   * @type {function(webdriver.Locator): ElementArrayFinder}
   */
  element.all = function(locator) {
    var elementArrayFinder = {};

    elementArrayFinder.count = function() {
      return ptor.findElements(locator).then(function(arr) {
        return arr.length;
      });
    };

    elementArrayFinder.get = function(index) {
      var id = ptor.findElements(locator).then(function(arr) {
        return arr[index];
      });
      return ptor.wrapWebElement(new webdriver.WebElement(ptor.driver, id));
    };

    elementArrayFinder.first = function() {
      var id = ptor.findElements(locator).then(function(arr) {
        if (!arr.length) {
          throw new Error('No element found using locator: ' + locator.message);
        }
        return arr[0];
      });
      return ptor.wrapWebElement(new webdriver.WebElement(ptor.driver, id));
    };

    elementArrayFinder.last = function() {
      var id = ptor.findElements(locator).then(function(arr) {
        return arr[arr.length - 1];
      });
      return ptor.wrapWebElement(new webdriver.WebElement(ptor.driver, id));
    };

    elementArrayFinder.then = function(fn) {
      return ptor.findElements(locator).then(fn);
    };

    elementArrayFinder.each = function(fn) {
      ptor.findElements(locator).then(function(arr) {
        arr.forEach(function(webElem) {
          fn(webElem);
        });
      });
    };

    return elementArrayFinder;
  }

  return element;
};

/**
 * Build the helper '$' function for a given instance of Protractor.
 *
 * @private
 * @param {Protractor} ptor
 * @return {function(string): ElementFinder}
 */
var buildCssHelper = function(ptor) {
  return function(cssSelector) {
    return buildElementHelper(ptor)(webdriver.By.css(cssSelector));
  };
};

/**
 * Build the helper '$$' function for a given instance of Protractor.
 *
 * @private
 * @param {Protractor} ptor
 * @return {function(string): ElementArrayFinder}
 */
var buildMultiCssHelper = function(ptor) {
  return function(cssSelector) {
    return buildElementHelper(ptor).all(webdriver.By.css(cssSelector));
  };
};

/**
 * @param {webdriver.WebDriver} webdriver
 * @param {string=} opt_baseUrl A base URL to run get requests against.
 * @param {string=body} opt_rootElement  Selector element that has an ng-app in
 *     scope.
 * @constructor
 */
var Protractor = function(webdriver, opt_baseUrl, opt_rootElement) {
  // These functions should delegate to the webdriver instance, but should
  // wait for Angular to sync up before performing the action. This does not
  // include functions which are overridden by protractor below.
  var methodsToSync = ['getCurrentUrl', 'getPageSource', 'getTitle'];

  // Mix all other driver functionality into Protractor.
  for (var method in webdriver) {
    if(!this[method] && typeof webdriver[method] == 'function') {
      if (methodsToSync.indexOf(method) !== -1) {
        mixin(this, webdriver, method, this.waitForAngular.bind(this));
      } else {
        mixin(this, webdriver, method);
      }
    }
  }

  /**
   * The wrapped webdriver instance. Use this to interact with pages that do
   * not contain Angular (such as a log-in screen).
   *
   * @type {webdriver.WebDriver}
   */
  this.driver = webdriver;

  /**
   * Helper function for finding elements.
   *
   * @type {function(webdriver.Locator): ElementFinder}
   */
  this.element = buildElementHelper(this);

  /**
   * Helper function for finding elements by css.
   *
   * @type {function(string): ElementFinder}
   */
  this.$ = buildCssHelper(this);

  /**
   * Helper function for finding arrays of elements by css.
   *
   * @type {function(string): ElementArrayFinder}
   */
  this.$$ = buildMultiCssHelper(this);

  /**
   * All get methods will be resolved against this base URL. Relative URLs are =
   * resolved the way anchor tags resolve.
   *
   * @type {string}
   */
  this.baseUrl = opt_baseUrl || '';

  /**
   * The css selector for an element on which to find Angular. This is usually
   * 'body' but if your ng-app is on a subsection of the page it may be
   * a subelement.
   *
   * @type {string}
   */
  this.rootEl = opt_rootElement || 'body';

  /**
   * If true, Protractor will not attempt to synchronize with the page before
   * performing actions. This can be harmful because Protractor will not wait
   * until $timeouts and $http calls have been processed, which can cause
   * tests to become flaky. This should be used only when necessary, such as
   * when a page continuously polls an API using $timeout.
   *
   * @type {boolean}
   */
  this.ignoreSynchronization = false;

  /**
   * An object that holds custom test parameters.
   *
   * @type {Object}
   */
  this.params = {};

  this.moduleNames_ = [];

  this.moduleScripts_ = [];
};

/**
 * Instruct webdriver to wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing.
 *
 * @return {!webdriver.promise.Promise} A promise that will resolve to the
 *    scripts return value.
 */
Protractor.prototype.waitForAngular = function() {
  if (this.ignoreSynchronization) {
    return webdriver.promise.fulfilled();
  }
  return this.driver.executeAsyncScript(
    clientSideScripts.waitForAngular, this.rootEl).then(function(browserErr) {
      if (browserErr) {
        throw 'Error while waiting for Protractor to ' +
              'sync with the page: ' + JSON.stringify(browserErr);
      }
    }).then(null, function(err) {
      if (!/asynchronous script timeout/.test(err.message)) {
        throw err;
      }
      var timeout = /[\d\.]*\ seconds/.exec(err.message);
      throw 'Timed out waiting for Protractor to synchronize with ' +
            'the page after ' + timeout;
    });
};

// TODO: activeelement also returns a WebElement.

/**
 * Wrap a webdriver.WebElement with protractor specific functionality.
 *
 * @param {webdriver.WebElement} element
 * @return {webdriver.WebElement} the wrapped web element.
 */
Protractor.prototype.wrapWebElement = function(element) {
  var thisPtor = this;
  // Before any of the WebElement functions, Protractor will wait to make sure
  // Angular is synched up.
  var originalFns = {};
  WEB_ELEMENT_FUNCTIONS.forEach(function(name) {
    originalFns[name] = element[name];
    element[name] = function() {
      thisPtor.waitForAngular();
      return originalFns[name].apply(element, arguments);
    }
  });

  var originalFindElement = element.findElement;
  var originalFindElements = element.findElements;
  var originalIsElementPresent = element.isElementPresent;

  /**
   * Shortcut for querying the document directly with css.
   *
   * @param {string} selector a css selector
   * @see webdriver.WebElement.findElement
   * @return {!webdriver.WebElement}
   */
  element.$ = function(selector) {
    var locator = protractor.By.css(selector);
    return this.findElement(locator);
  }

  /**
   * @see webdriver.WebElement.findElement
   * @return {!webdriver.WebElement}
   */
  element.findElement = function(locator, varArgs) {
    thisPtor.waitForAngular();

    var found;
    if (locator.findElementsOverride) {
      found = thisPtor.findElementsOverrideHelper_(element, locator);
    } else {
      found = originalFindElement.apply(element, arguments);
    }

    return thisPtor.wrapWebElement(found);
  };

  /**
   * Shortcut for querying the document directly with css.
   *
   * @param {string} selector a css selector
   * @see webdriver.WebElement.findElements
   * @return {!webdriver.promise.Promise} A promise that will be resolved to an
   *     array of the located {@link webdriver.WebElement}s.
   */
  element.$$ = function(selector) {
    var locator = protractor.By.css(selector);
    return this.findElements(locator);
  }

  /**
   * @see webdriver.WebElement.findElements
   * @return {!webdriver.promise.Promise} A promise that will be resolved to an
   *     array of the located {@link webdriver.WebElement}s.
   */
  element.findElements = function(locator, varArgs) {
    thisPtor.waitForAngular();

    var found;
    if (locator.findElementsOverride) {
      found = locator.findElementsOverride(element.getDriver(), element);
    } else {
      found = originalFindElements.apply(element, arguments);
    }

    return found.then(function(elems) {
      for (var i = 0; i < elems.length; ++i) {
        thisPtor.wrapWebElement(elems[i]);
      }

      return elems;
    });
  }

  /**
   * @see webdriver.WebElement.isElementPresent
   * @return {!webdriver.promise.Promise} A promise that will be resolved with
   *     whether an element could be located on the page.
   */
  element.isElementPresent = function(locator, varArgs) {
    thisPtor.waitForAngular();
    if (locator.findElementsOverride) {
      return locator.findElementsOverride(element.getDriver(), element).
          then(function (arr) {
            return !!arr.length;
          });
    }
    return originalIsElementPresent.apply(element, arguments);
  };

  /**
   * Evalates the input as if it were on the scope of the current element.
   * @param {string} expression
   *
   * @return {!webdriver.promise.Promise} A promise that will resolve to the
   *     evaluated expression. The result will be resolved as in
   *     {@link webdriver.WebDriver.executeScript}. In summary - primitives will
   *     be resolved as is, functions will be converted to string, and elements
   *     will be returned as a WebElement.
   */
  element.evaluate = function(expression) {
    thisPtor.waitForAngular();
    return element.getDriver().executeScript(clientSideScripts.evaluate,
        element, expression);
  };

  return element;
};

/**
 * Waits for Angular to finish rendering before searching for elements.
 * @see webdriver.WebDriver.findElement
 * @return {!webdriver.WebElement}
 */
Protractor.prototype.findElement = function(locator, varArgs) {
  var found;
  this.waitForAngular();

  if (locator.findElementsOverride) {
    found = this.findElementsOverrideHelper_(null, locator);
  } else {
    found = this.driver.findElement(locator, varArgs);
  }

  return this.wrapWebElement(found);
};

/**
 * Waits for Angular to finish rendering before searching for elements.
 * @see webdriver.WebDriver.findElements
 * @return {!webdriver.promise.Promise} A promise that will be resolved to an
 *     array of the located {@link webdriver.WebElement}s.
 */
Protractor.prototype.findElements = function(locator, varArgs) {
  var self = this, found;
  this.waitForAngular();

  if (locator.findElementsOverride) {
    found = locator.findElementsOverride(this.driver);
  } else {
    found = this.driver.findElements(locator, varArgs);
  }

  return found.then(function(elems) {
    for (var i = 0; i < elems.length; ++i) {
      self.wrapWebElement(elems[i]);
    }

    return elems;
  });
};

/**
 * Tests if an element is present on the page.
 * @see webdriver.WebDriver.isElementPresent
 * @return {!webdriver.promise.Promise} A promise that will resolve to whether
 *     the element is present on the page.
 */
Protractor.prototype.isElementPresent = function(locatorOrElement, varArgs) {
  this.waitForAngular();
  if (locatorOrElement.findElementsOverride) {
    return locatorOrElement.findElementsOverride(this.driver).then(function(arr) {
      return !!arr.length;
    });
  }
  return this.driver.isElementPresent(locatorOrElement, varArgs);
};

/**
 * Add a module to load before Angular whenever Protractor.get is called.
 * Modules will be registered after existing modules already on the page,
 * so any module registered here will override preexisting modules with the same
 * name.
 *
 * @param {!string} name The name of the module to load or override.
 * @param {!string|Function} script The JavaScript to load the module.
 */
Protractor.prototype.addMockModule = function(name, script) {
  this.moduleNames_.push(name);
  this.moduleScripts_.push(script);
};

/**
 * Clear the list of registered mock modules.
 */
Protractor.prototype.clearMockModules = function() {
  this.moduleNames_ = [];
  this.moduleScripts_ = [];
};

/**
 * See webdriver.WebDriver.get
 *
 * Navigate to the given destination and loads mock modules before
 * Angular. Assumes that the page being loaded uses Angular.
 * If you need to access a page which does have Angular on load, use
 * the wrapped webdriver directly.
 *
 * @param {string} destination Destination URL.
 * @param {=number} opt_timeout Number of seconds to wait for Angular to start.
 */
Protractor.prototype.get = function(destination, opt_timeout) {
  if (this.ignoreSynchronization) {
    return this.driver.get(destination);
  }
  var timeout = opt_timeout || 10;
  destination = url.resolve(this.baseUrl, destination);

  this.driver.get('about:blank');
  this.driver.executeScript(
      'window.name = "' + DEFER_LABEL + '" + window.name;' +
      'window.location.href = "' + destination + '"');

  var assertAngularOnPage = function(arr) {
    var hasAngular = arr[0];
    if (!hasAngular) {
      var message = arr[1];
      throw new Error('Angular could not be found on the page ' +
          destination + " : " + message);
    }
  };

  // Make sure the page is an Angular page.
  var self = this;
  self.driver.executeAsyncScript(clientSideScripts.testForAngular, timeout).
    then(assertAngularOnPage, function(err) {
      if (/reload detected during async script/.test(err.message)) {
        // Sometimes IE will fail to run scripts right after a location change.
        // Let's try it once more.
        self.driver.executeAsyncScript(
            clientSideScripts.testForAngular, timeout).
          then(assertAngularOnPage, function(err) {
            if (/reload detected during async script/.test(err.message)) {
              throw 'Persistent async reload interrupt problem: ' + err.message;
            } else {
              throw 'Error while running testForAngular: ' + err.message;
            }
          });
      } else {
        throw 'Error while running testForAngular: ' + err.message;
      }
    });

  // At this point, Angular will pause for us, until angular.resumeBootstrap
  // is called.
  for (var i = 0; i < this.moduleScripts_.length; ++i) {
    name = this.moduleNames_[i];
    this.driver.executeScript(this.moduleScripts_[i]).
      then(null, function(err) {
        throw 'Error wile running module script ' + name +
            ': ' + err.message;
      });
  }

  return this.driver.executeScript(function() {
    // Continue to bootstrap Angular.
    angular.resumeBootstrap(arguments[0]);
  }, this.moduleNames_);
};

/**
 * Returns the current absolute url from AngularJS.
 */
Protractor.prototype.getLocationAbsUrl = function() {
  this.waitForAngular();
  return this.driver.executeScript(clientSideScripts.getLocationAbsUrl, this.rootEl);
};

/**
 * Pauses the test and injects some helper functions into the browser, so that
 * debugging may be done in the browser console.
 *
 * This should be used under node in debug mode, i.e. with
 * protractor debug <configuration.js>
 *
 * While in the debugger, commands can be scheduled through webdriver by
 * entering the repl:
 *   debug> repl
 *   Press Ctrl + C to leave rdebug repl
 *   > ptor.findElement(protractor.By.input('user').sendKeys('Laura'));
 *   > ptor.debugger();
 *   debug> c
 *
 * This will run the sendKeys command as the next task, then re-enter the
 * debugger.
 */
Protractor.prototype.debugger = function() {
  var clientSideScriptsList = [];
  for (script in clientSideScripts) {
    clientSideScriptsList.push(
      script + ': ' + clientSideScripts[script].toString());
  }

  this.driver.executeScript(
    'window.clientSideScripts = {' + clientSideScriptsList.join(', ') + '}')

  var flow = webdriver.promise.controlFlow();
  flow.execute(function() {
    debugger;
  });
};

/**
 * Builds a single web element from a locator with a findElementsOverride.
 * Throws an error if an element is not found, and issues a warning
 * if more than one element is described by the selector.
 *
 * @private
 * @param {webdriver.WebElement} using A WebElement to scope the find,
 *     or null.
 * @param {webdriver.Locator} locator
 * @return {webdriver.WebElement}
 */
Protractor.prototype.findElementsOverrideHelper_ = function(using, locator) {
  // We need to return a WebElement, so we construct one using a promise
  // which will resolve to a WebElement.
  return new webdriver.WebElement(
      this.driver,
      locator.findElementsOverride(this.driver, using).then(function(arr) {
        if (!arr.length) {
          throw new Error('No element found using locator: ' + locator.message);
        }
        if (arr.length > 1) {
          util.puts('warning: more than one element found for locator ' +
              locator.message +
              '- you may need to be more specific');
        }
        return arr[0];
      }));
};

/**
 * Create a new instance of Protractor by wrapping a webdriver instance.
 *
 * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
 * @param {string=} opt_baseUrl A URL to prepend to relative gets.
 * @return {Protractor}
 */
exports.wrapDriver = function(webdriver, opt_baseUrl, opt_rootElement) {
  return new Protractor(webdriver, opt_baseUrl, opt_rootElement);
};

/**
 * @type {Protractor}
 */
var instance;

/**
 * Set a singleton instance of protractor.
 * @param {Protractor} ptor
 */
exports.setInstance = function(ptor) {
  instance = ptor;
};

/**
 * Get the singleton instance.
 * @return {Protractor}
 */
exports.getInstance = function() {
  return instance;
}

/**
 * Utility function that filters a stack trace to be more readable. It removes
 * Jasmine test frames and webdriver promise resolution.
 * @param {string} text Original stack trace.
 * @return {string}
 */
exports.filterStackTrace = function(text) {
  if (!text) {
    return text;
  }
  var jasmineFilename = 'node_modules/minijasminenode/lib/jasmine-1.3.1.js';
  var seleniumFilename = 'node_modules/selenium-webdriver';
  var lines = [];
  text.split(/\n/).forEach(function(line){
    if (line.indexOf(jasmineFilename) == -1 &&
        line.indexOf(seleniumFilename) == -1) {
      lines.push(line);
    }
  });
  return lines.join('\n');
}
