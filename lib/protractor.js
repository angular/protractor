var url = require('url');
var util = require('util');
var webdriver = require('selenium-webdriver');

var clientSideScripts = require('./clientsidescripts.js');
var ProtractorBy = require('./locators.js').ProtractorBy;

var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';

/**
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (foo in webdriver) {
  exports[foo] = webdriver[foo];
}

/**
 * Mix a function from one object onto another. The function will still be
 * called in the context of the original object.
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
  }
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
      clientSideScripts.waitForAngular, this.rootEl).then(null, function(err) {
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
 */
Protractor.prototype.wrapWebElement = function(element) {
  var thisPtor = this;
  // Before any of these WebElement functions, Protractor will wait to make sure
  // Angular is synched up.
  var functionsToSync = [
    'click', 'sendKeys', 'getTagName', 'getCssValue', 'getAttribute', 'getText',
    'getSize', 'getLocation', 'isEnabled', 'isSelected', 'submit', 'clear',
    'isDisplayed', 'getOuterHtml', 'getInnerHtml'];
  var originalFns = {};
  functionsToSync.forEach(function(name) {
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
   * @see webdriver.WebElement.findElement
   * @return {!webdriver.WebElement}
   */
  element.findElement = function(locator, varArgs) {
    thisPtor.waitForAngular();
    if (locator.findOverride) {
      return locator.findOverride(element.getDriver(), element);
    }
    return originalFindElement.apply(element, arguments);
  };

  /**
   * @see webdriver.WebElement.findElements
   * @return {!webdriver.promise.Promise} A promise that will be resolved to an
   *     array of the located {@link webdriver.WebElement}s.
   */
  element.findElements = function(locator, varArgs) {
    thisPtor.waitForAngular();
    if (locator.findArrayOverride) {
      return locator.findArrayOverride(element.getDriver(), element);
    }
    return originalFindElements.apply(element, arguments);
  }

  /**
   * @see webdriver.WebElement.isElementPresent
   * @return {!webdriver.promise.Promise} A promise that will be resolved with
   *     whether an element could be located on the page.
   */
  element.isElementPresent = function(locator, varArgs) {
    thisPtor.waitForAngular();
    if (locator.findArrayOverride) {
      return locator.findArrayOverride(element.getDriver(), element).
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
  this.waitForAngular();
  if (locator.findOverride) {
    return this.wrapWebElement(locator.findOverride(this.driver));
  }
  return this.wrapWebElement(this.driver.findElement(locator, varArgs));
};

/**
 * Waits for Angular to finish rendering before searching for elements.
 * @see webdriver.WebDriver.findElements
 * @return {!webdriver.promise.Promise} A promise that will be resolved to an
 *     array of the located {@link webdriver.WebElement}s.
 */
Protractor.prototype.findElements = function(locator, varArgs) {
  var self = this;
  this.waitForAngular();
  if (locator.findArrayOverride) {
    return locator.findArrayOverride(this.driver).then(function(elems) {
      for (var i = 0; i < elems.length; ++i) {
        self.wrapWebElement(elems[i]);
      }
      return elems;
    });
  }
  return this.driver.findElements(locator, varArgs);
};

/**
 * Tests if an element is present on the page.
 * @see webdriver.WebDriver.isElementPresent
 * @return {!webdriver.promise.Promise} A promise that will resolve to whether
 *     the element is present on the page.
 */
Protractor.prototype.isElementPresent = function(locatorOrElement, varArgs) {
  this.waitForAngular();
  if (locatorOrElement.findArrayOverride) {
    return locatorOrElement.findArrayOverride(this.driver).then(function(arr) {
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
 * Angular.
 */
Protractor.prototype.get = function(destination) {
  destination = url.resolve(this.baseUrl, destination);

  this.driver.get('about:blank');
  this.driver.executeScript(
      'window.name = "' + DEFER_LABEL + '" + window.name;' +
      'window.location.href = "' + destination + '"');

  // Make sure the page is an Angular page.
  this.driver.executeAsyncScript(clientSideScripts.testForAngular, 10).
    then(function(hasAngular) {
      if (!hasAngular) {
        throw new Error('Angular could not be found on the page ' +
            destination);
      }
    });

  // At this point, Angular will pause for us, until angular.resumeBootstrap
  // is called.
  for (var i = 0; i < this.moduleScripts_.length; ++i) {
    this.driver.executeScript(this.moduleScripts_[i]);
  }

  return this.driver.executeScript(function() {
    // Continue to bootstrap Angular.
    angular.resumeBootstrap(arguments[0]);
  }, this.moduleNames_);
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
 * @type {ProtractorBy}
 */
exports.By = new ProtractorBy();
