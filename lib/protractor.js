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

/*
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (var foo in webdriver) {
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
 * @param {Array.<webdriver.Locator>=} opt_usingChain
 * @return {function(webdriver.Locator): ElementFinder}
 */
var buildElementHelper = function(ptor, opt_usingChain) {
  var usingChain = opt_usingChain || [];
  var using = function() {
    var base = ptor;
      for (var i = 0; i < usingChain.length; ++i) {
      base = base.findElement(usingChain[i]);
    }
    return base;
  };

  /**
   * The element function returns an Element Finder. Element Finders do
   * not actually attempt to find the element until a method is called on them,
   * which means they can be set up in helper files before the page is
   * available.
   *
   * @alias element(locator)
   * @view
   * <span>{{person.name}}</span>
   * <span ng-bind="person.email"></span>
   * <input type="text" ng-model="person.name"/>
   *
   * @example
   * // Find element with {{scopeVar}} syntax.
   * element(by.binding('person.name')).getText().then(function(name) {
   *   expect(name).toBe('Foo');
   * });
   *
   * // Find element with ng-bind="scopeVar" syntax.
   * expect(element(by.binding('person.email')).getText()).toBe('foo@bar.com');
   *
   * // Find by model.
   * var input = element(by.model('person.name'));
   * input.sendKeys('123');
   * expect(input.getAttribute('value')).toBe('Foo123');
   *
   * @param {webdriver.Locator} locator An element locator.
   * @return {ElementFinder}
   */
  var element = function(locator) {
    var elementFinder = {};

    var webElementFns = WEB_ELEMENT_FUNCTIONS.concat(
        ['findElements', 'isElementPresent', 'evaluate', '$$']);
    webElementFns.forEach(function(fnName) {
      elementFinder[fnName] = function() {
        var args = arguments;

        return using().findElement(locator).then(function(element) {
          return element[fnName].apply(element, args);
        }, function(error) {
          throw error;
        });
      };
    });

    // This is a special case since it doesn't return a promise, instead it
    // returns a WebElement.
    elementFinder.findElement = function(subLocator) {
      return using().findElement(locator).findElement(subLocator);
    };

    /**
     * Return the actual WebElement.
     *
     * @alias element(locator).find()
     * @return {webdriver.WebElement}
     */
    elementFinder.find = function() {
      return using().findElement(locator);
    };

    /**
     * Determine whether an element is present on the page.
     *
     * @alias element(locator).isPresent()
     *
     * @view
     * <span>{{person.name}}</span>
     *
     * @example
     * // Element exists.
     * expect(element(by.binding('person.name')).isPresent()).toBe(true);
     *
     * // Element not present.
     * expect(element(by.binding('notPresent')).isPresent()).toBe(false);
     *
     * @return {!webdriver.promise.Promise} A promise which resolves to a
     *     boolean.
     */
    elementFinder.isPresent = function() {
      return using().isElementPresent(locator);
    };

    /**
     * Calls to element may be chained to find elements within a parent.
     *
     * @alias element(locator).element(locator)
     * @view
     * <div class="parent">
     *   <div class="child">
     *     Child text
     *     <div>{{person.phone}}</div>
     *   </div>
     * </div>
     *
     * @example
     * // Chain 2 element calls.
     * var child = element(by.css('.parent')).
     *     element(by.css('.child'));
     * expect(child.getText()).toBe('Child text\n555-123-4567');
     *
     * // Chain 3 element calls.
     * var triple = element(by.css('.parent')).
     *     element(by.css('.child')).
     *     element(by.binding('person.phone'));
     * expect(triple.getText()).toBe('555-123-4567');
     *
     * @param {Protractor} ptor
     * @param {Array.<webdriver.Locator>=} opt_usingChain
     * @return {function(webdriver.Locator): ElementFinder}
     */
    elementFinder.element =
        buildElementHelper(ptor, usingChain.concat(locator));

    /**
     * Shortcut for chaining css element finders.
     *
     * @alias element(locator).$(cssSelector)
     * @view
     * <div class="parent">
     *   <div class="child">
     *     Child text
     *     <div class="grandchild">{{person.phone}}</div>
     *   </div>
     * </div>
     *
     * @example
     * // Chain 2 element calls.
     * var child = element(by.css('.parent')).$('.child');
     * expect(child.getText()).toBe('Child text\n555-123-4567');
     *
     * // Chain 3 element calls.
     * var triple = $('.parent').$('.child').$('.grandchild');
     * expect(triple.getText()).toBe('555-123-4567');
     *
     * @param {string} cssSelector A css selector.
     * @return {ElementFinder}
     */
    elementFinder.$ = function(cssSelector) {
      return buildElementHelper(ptor, usingChain.concat(locator))(
          webdriver.By.css(cssSelector));
    };

    return elementFinder;
  };

  /**
   * element.all is used for operations on an array of elements (as opposed
   * to a single element).
   *
   * @alias element.all(locator)
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * element.all(by.css('.items li')).then(function(items) {
   *   expect(items.length).toBe(3);
   *   expect(items[0].getText()).toBe('First');
   * });
   *
   * @param {webdriver.Locator} locator
   * @return {ElementArrayFinder}
   */
  element.all = function(locator) {
    var elementArrayFinder = {};

    /**
     * Count the number of elements found by the locator.
     *
     * @alias element.all(locator).count()
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * var list = element.all(by.css('.items li'));
     * expect(list.count()).toBe(3);
     *
     * @return {!webdriver.promise.Promise} A promise which resolves to the
     *     number of elements matching the locator.
     */
    elementArrayFinder.count = function() {
      return using().findElements(locator).then(function(arr) {
        return arr.length;
      });
    };

    /**
     * Get an element found by the locator by index. The index starts at 0.
     *
     * @alias element.all(locator).get(index)
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * var list = element.all(by.css('.items li'));
     * expect(list.get(0).getText()).toBe('First');
     * expect(list.get(1).getText()).toBe('Second');
     *
     * @param {number} index Element index.
     * @return {webdriver.WebElement} The element at the given index
     */
    elementArrayFinder.get = function(index) {
      var id = using().findElements(locator).then(function(arr) {
        return arr[index];
      });
      return ptor.wrapWebElement(new webdriver.WebElement(ptor.driver, id));
    };

    /**
     * Get the first element found using the locator.
     *
     * @alias element.all(locator).first()
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * var list = element.all(by.css('.items li'));
     * expect(list.first().getText()).toBe('First');
     *
     * @return {webdriver.WebElement} The first matching element
     */
    elementArrayFinder.first = function() {
      var id = using().findElements(locator).then(function(arr) {
        if (!arr.length) {
          throw new Error('No element found using locator: ' + locator.message);
        }
        return arr[0];
      });
      return ptor.wrapWebElement(new webdriver.WebElement(ptor.driver, id));
    };

    /**
     * Get the last matching element for the locator.
     *
     * @alias element.all(locator).last()
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * var list = element.all(by.css('.items li'));
     * expect(list.last().getText()).toBe('Third');
     *
     * @return {webdriver.WebElement} the last matching element
     */
    elementArrayFinder.last = function() {
      var id = using().findElements(locator).then(function(arr) {
        return arr[arr.length - 1];
      });
      return ptor.wrapWebElement(new webdriver.WebElement(ptor.driver, id));
    };

    /**
     * @type {webdriver.promise.Promise} a promise which will resolve to
     *     an array of WebElements matching the locator.
     */
    elementArrayFinder.then = function(fn) {
      return using().findElements(locator).then(fn);
    };

    /**
     * Calls the input function on each WebElement found by the locator.
     *
     * @alias element.all(locator).each(eachFunction)
     * @view
     * <ul class="items">
     *   <li>First</li>
     *   <li>Second</li>
     *   <li>Third</li>
     * </ul>
     *
     * @example
     * element.all(by.css('.items li')).each(function(element) {
     *   // Will print First, Second, Third.
     *   element.getText().then(console.log);
     * });
     *
     * @param {function(webdriver.WebElement)} fn Input function
     */
    elementArrayFinder.each = function(fn) {
      using().findElements(locator).then(function(arr) {
        arr.forEach(function(webElem) {
          fn(webElem);
        });
      });
    };

    /**
     * Apply a map function to each element found using the locator. The
     * callback receives the web element as the first argument and the index as
     * a second arg.
     *
     * @alias element.all(locator).map(mapFunction)
     * @view
     * <ul class="items">
     *   <li class="one">First</li>
     *   <li class="two">Second</li>
     *   <li class="three">Third</li>
     * </ul>
     *
     * @example
     * var items = element.all(by.css('.items li')).map(function(elm, index) {
     *   return {
     *     index: index,
     *     text: elm.getText(),
     *     class: elm.getAttribute('class')
     *   };
     * });
     * expect(items).toEqual([
     *   {index: 0, text: 'First', class: 'one'},
     *   {index: 1, text: 'Second', class: 'two'},
     *   {index: 2, text: 'Third', class: 'three'}
     * ]);
     *
     * @param {function(webdriver.WebElement, number)} mapFn Map function that
     *     will be applied to each element.
     * @return {!webdriver.promise.Promise} A promise that resolves to an array
     *     of values returned by the map function.
     */
    elementArrayFinder.map = function(mapFn) {
      return using().findElements(locator).then(function(arr) {
        var list = [];
        arr.forEach(function(webElem, index) {
          var mapResult = mapFn(webElem, index);
          // All nested arrays and objects will also be fully resolved.
          webdriver.promise.fullyResolved(mapResult).then(function(resolved) {
            list.push(resolved);
          });
        });
        return list;
      });
    };

    return elementArrayFinder;
  };

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
 * @param {string=} opt_rootElement  Selector element that has an ng-app in
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
      var timeout;
      if (/asynchronous script timeout/.test(err.message)) {
        // Timeout on Chrome
        timeout = /[\d\.]*\ seconds/.exec(err.message);
      } else if (/Timed out waiting for async script/.test(err.message)) {
        // Timeout on Firefox
        timeout = /[\d\.]*ms/.exec(err.message);
      } else if (/Timed out waiting for an asynchronous script/.test(err.message)) {
        // Timeout on Safari
        timeout = /[\d\.]*\ ms/.exec(err.message);
      }
      if (timeout) {
        throw 'Timed out waiting for Protractor to synchronize with ' +
            'the page after ' + timeout + '. Please see ' +
            'https://github.com/angular/protractor/blob/master/docs/faq.md';
      } else {
        throw err;
      }
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
  // Angular is synced up.
  var originalFns = {};
  WEB_ELEMENT_FUNCTIONS.forEach(function(name) {
    originalFns[name] = element[name];
    element[name] = function() {
      thisPtor.waitForAngular();
      return originalFns[name].apply(element, arguments);
    };
  });

  var originalFindElement = element.findElement;
  var originalFindElements = element.findElements;
  var originalIsElementPresent = element.isElementPresent;

  /**
   * Shortcut for querying the document directly with css.
   *
   * @alias $(cssSelector)
   * @view
   * <div class="count">
   *   <span class="one">First</span>
   *   <span class="two">Second</span>
   * </div>
   *
   * @example
   * var item = $('.count .two');
   * expect(item.getText()).toBe('Second');
   *
   * @param {string} selector A css selector
   * @see webdriver.WebElement.findElement
   * @return {!webdriver.WebElement}
   */
  element.$ = function(selector) {
    var locator = protractor.By.css(selector);
    return this.findElement(locator);
  };

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
   * @alias $$(cssSelector)
   * @view
   * <div class="count">
   *   <span class="one">First</span>
   *   <span class="two">Second</span>
   * </div>
   *
   * @example
   * // The following protractor expressions are equivalent.
   * var list = element.all(by.css('.count span'));
   * expect(list.count()).toBe(2);
   *
   * list = $$('.count span');
   * expect(list.count()).toBe(2);
   * expect(list.get(0).getText()).toBe('First');
   * expect(list.get(1).getText()).toBe('Second');
   *
   * @param {string} selector a css selector
   * @see webdriver.WebElement.findElements
   * @return {!webdriver.promise.Promise} A promise that will be resolved to an
   *     array of the located {@link webdriver.WebElement}s.
   */
  element.$$ = function(selector) {
    var locator = protractor.By.css(selector);
    return this.findElements(locator);
  };

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
  };

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
   * Evaluates the input as if it were on the scope of the current element.
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
 * Remove a registered mock module.
 * @param {!string} name The name of the module to remove.
 */
Protractor.prototype.removeMockModule = function (name) {
  var index = this.moduleNames_.indexOf(name);
  this.moduleNames_.splice(index, 1);
  this.moduleScripts_.splice(index, 1);
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
 * @param {number=} opt_timeout Number of seconds to wait for Angular to start.
 */
Protractor.prototype.get = function(destination, opt_timeout) {
  var timeout = opt_timeout || 10;
  var self = this;

  destination = url.resolve(this.baseUrl, destination);

  if (this.ignoreSynchronization) {
    return this.driver.get(destination);
  }

  this.driver.get('about:blank');
  this.driver.executeScript(
      'window.name = "' + DEFER_LABEL + '" + window.name;' +
      'window.location.assign("' + destination + '");');

  // At this point, we need to make sure the new url has loaded before
  // we try to execute any asynchronous scripts.
  this.driver.wait(function() {
    return self.driver.getCurrentUrl().then(function(url) {
      return url !== 'about:blank';
    });
  }, timeout * 1000, 'Timed out waiting for page to load');

  var assertAngularOnPage = function(arr) {
    var hasAngular = arr[0];
    if (!hasAngular) {
      var message = arr[1];
      throw new Error('Angular could not be found on the page ' +
          destination + " : " + message);
    }
  };

  // Make sure the page is an Angular page.

  self.driver.executeAsyncScript(clientSideScripts.testForAngular, timeout).
    then(assertAngularOnPage, function(err) {
      throw 'Error while running testForAngular: ' + err.message;
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
  for (var script in clientSideScripts) {
    clientSideScriptsList.push(
      script + ': ' + clientSideScripts[script].toString());
  }

  this.driver.executeScript(
    'window.clientSideScripts = {' + clientSideScriptsList.join(', ') + '}');

  var flow = webdriver.promise.controlFlow();
  flow.execute(function() {
    debugger;
  }, 'add breakpoint to control flow');
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
};

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
  var substringsToFilter = [
    'node_modules/minijasminenode/lib/',
    'node_modules/selenium-webdriver',
    'at Module.',
    'at Object.Module.',
    'at Function.Module',
    '(timers.js:',
    'jasminewd/index.js'
  ];
  var lines = [];
  text.split(/\n/).forEach(function(line) {
    var include = true;
    for (var i = 0; i < substringsToFilter.length; ++i) {
      if (line.indexOf(substringsToFilter[i]) !== -1) {
        include = false;
      }
    }
    if (include) {
      lines.push(line);
    }
  });
  return lines.join('\n');
};
