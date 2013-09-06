var url = require('url');
var util = require('util');
var webdriver = require('selenium-webdriver');

var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';

/**
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (foo in webdriver) {
  exports[foo] = webdriver[foo];
}

/**
 * All scripts to be run on the client via executeAsyncScript or
 * executeScript should be put here. These scripts are transmitted over
 * the wire using their toString representation, and cannot reference
 * external variables. They can, however use the array passed in to
 * arguments. Instead of params, all functions on clientSideScripts
 * should list the arguments array they expect.
 */
var clientSideScripts = {};

/**
 * Wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing.
 *
 * arguments[0] {string} The selector housing an ng-app
 * arguments[1] {function} callback
 */
clientSideScripts.waitForAngular = function() {
  var el = document.querySelector(arguments[0]);
  var callback = arguments[1];
  angular.element(el).injector().get('$browser').
      notifyWhenNoOutstandingRequests(callback);
};

/**
 * Find an element in the page by their angular binding.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The binding, e.g. {{cat.name}}.
 *
 * @return {WebElement} The element containing the binding.
 */
clientSideScripts.findBinding = function() {
  var using = arguments[0] || document;
  var binding = arguments[1];
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var bindingName = angular.element(bindings[i]).data().$binding[0].exp ||
        angular.element(bindings[i]).data().$binding;
    if (bindingName.indexOf(binding) != -1) {
      matches.push(bindings[i]);
    }
  }
  return matches[0]; // We can only return one with webdriver.findElement.
};

/**
 * Find a list of elements in the page by their angular binding.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The binding, e.g. {{cat.name}}.
 *
 * @return {Array.<WebElement>} The elements containing the binding.
 */
clientSideScripts.findBindings = function() {
  var using = arguments[0] || document;
  var binding = arguments[1];
  var bindings = using.getElementsByClassName('ng-binding');
  var matches = [];
  for (var i = 0; i < bindings.length; ++i) {
    var bindingName = angular.element(bindings[i]).data().$binding[0].exp ||
        angular.element(bindings[i]).data().$binding;
    if (bindingName.indexOf(binding) != -1) {
      matches.push(bindings[i]);
    }
  }
  return matches; // Return the whole array for webdriver.findElements.
};

/**
 * Find a row within an ng-repeat.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[2] {number} The row index.
 *
 * @return {Element} The row element.
 */
 clientSideScripts.findRepeaterRow = function() {
  var using = arguments[0] || document;
  var repeater = arguments[1];
  var index = arguments[2];

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  return rows[index - 1];
 };

/**
 * Find an element within an ng-repeat by its row and column.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[2] {number} The row index.
 * arguments[3] {string} The column binding, e.g. '{{cat.name}}'.
 *
 * @return {Element} The element.
 */
clientSideScripts.findRepeaterElement = function() {
  var matches = [];
  var using = arguments[0] || document;
  var repeater = arguments[1];
  var index = arguments[2];
  var binding = arguments[3];

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  var row = rows[index - 1];
  var bindings = [];
  if (row.className.indexOf('ng-binding') != -1) {
    bindings.push(row);
  }
  var childBindings = row.getElementsByClassName('ng-binding');
  for (var i = 0; i < childBindings.length; ++i) {
    bindings.push(childBindings[i]);
  }
  for (var i = 0; i < bindings.length; ++i) {
    var bindingName = angular.element(bindings[i]).data().$binding[0].exp ||
        angular.element(bindings[i]).data().$binding;
    if (bindingName.indexOf(binding) != -1) {
      matches.push(bindings[i]);
    }
  }
  // We can only return one with webdriver.findElement.
  return matches[0];
};

/**
 * Find the elements in a column of an ng-repeat.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The text of the repeater, e.g. 'cat in cats'.
 * arguments[2] {string} The column binding, e.g. '{{cat.name}}'.
 *
 * @return {Array.<Element>} The elements in the column.
 */
clientSideScripts.findRepeaterColumn = function() {
  var matches = [];
  var using = arguments[0] || document;
  var repeater = arguments[1];
  var binding = arguments[2];

  var rows = [];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var attr = prefixes[p] + 'repeat';
    var repeatElems = using.querySelectorAll('[' + attr + ']');
    attr = attr.replace(/\\/g, '');
    for (var i = 0; i < repeatElems.length; ++i) {
      if (repeatElems[i].getAttribute(attr).indexOf(repeater) != -1) {
        rows.push(repeatElems[i]);
      }
    }
  }
  for (var i = 0; i < rows.length; ++i) {
    var bindings = [];
    if (rows[i].className.indexOf('ng-binding') != -1) {
      bindings.push(rows[i]);
    }
    var childBindings = rows[i].getElementsByClassName('ng-binding');
    for (var k = 0; k < childBindings.length; ++k) {
      bindings.push(childBindings[k]);
    }
    for (var j = 0; j < bindings.length; ++j) {
      var bindingName = angular.element(bindings[j]).data().$binding[0].exp ||
          angular.element(bindings[j]).data().$binding;
      if (bindingName.indexOf(binding) != -1) {
        matches.push(bindings[j]);
      }
    }
  }
  return matches;
};

/**
 * Find an input element by model name.
 *
 * arguments[0] {Element} The scope of the search.
 * arguments[1] {string} The model name.
 *
 * @return {Element} The first matching input element.
*/
clientSideScripts.findInput = function() {
  var using = arguments[0] || document;
  var model = arguments[1];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = 'input[' + prefixes[p] + 'model="' + model + '"]';
    var inputs = using.querySelectorAll(selector);
    if (inputs.length) {
      return inputs[0];
    }
  }
};

 /**
  * Find an select element by model name.
  *
  * arguments[0] {Element} The scope of the search.
  * arguments[1] {string} The model name.
  *
  * @return {Element} The first matching select element.
  */
clientSideScripts.findSelect = function() {
  var using = arguments[0] || document;
  var model = arguments[1];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector = 'select[' + prefixes[p] + 'model="' + model + '"]';
    var inputs = using.querySelectorAll(selector);
    if (inputs.length) {
      return inputs[0];
    }
  }
};

/**
  * Find an selected option element by model name.
  *
  * arguments[0] {Element} The scope of the search.
  * arguments[1] {string} The model name.
  *
  * @return {Element} The first matching input element.
  */
clientSideScripts.findSelectedOption = function() {
  var using = arguments[0] || document;
  var model = arguments[1];
  var prefixes = ['ng-', 'ng_', 'data-ng-', 'x-ng-', 'ng\\:'];
  for (var p = 0; p < prefixes.length; ++p) {
    var selector =
        'select[' + prefixes[p] + 'model="' + model + '"] option:checked';
    var inputs = using.querySelectorAll(selector);
    if (inputs.length) {
      return inputs[0];
    }
  }
};

/**
 * Tests whether the angular global variable is present on a page. Retries
 * in case the page is just loading slowly.
 *
 * arguments none.
 */
 clientSideScripts.testForAngular = function() {
  var attempts = arguments[0];
  var callback = arguments[arguments.length - 1];
  var check = function(n) {
    if (window.angular && window.angular.resumeBootstrap) {
      callback(true);
    } else if (n < 1) {
      callback(false);
    } else {
      window.setTimeout(function() {check(n - 1)}, 1000);
    }
  };
  check(attempts);
};


/**
 * Mix a function from one object onto another. The function will still be
 * called in the context of the original object.
 * @param {Object} to
 * @param {Object} from
 * @param {string} fnName
 */
var mixin = function(to, from, fnName) {
  to[fnName] = function() {
    return from[fnName].apply(from, arguments);
  }
};


/**
 * @param {webdriver.WebDriver} webdriver
 * @param {string=} opt_baseUrl A base URL to run get requests against.
 * @param {string=body} opt_rootElement  Selector el that has an ng-app in scope
 * @constructor
 */
var Protractor = function(webdriver, opt_baseUrl, opt_rootElement) {
  // Mix all other driver functionality into Protractor.
  for (var foo in webdriver) {
    if(!this[foo] && typeof webdriver[foo] == 'function') {
      mixin(this, webdriver, foo);
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
   * The css selector for anmelement on which to find Angular. This is usually
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
      clientSideScripts.waitForAngular, this.rootEl);
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
   *     webdriver.WebDriver.executeScript. In summary - primitives will be
   *     resolved as is, functions will be converted to string, and elements
   *     will be returned as a WebElement.
   */
  element.evaluate = function(expression) {
    // TODO: put into clientSideScripts
    thisPtor.waitForAngular();
    return element.getDriver().executeScript(function() {
      var element = arguments[0];
      var expression = arguments[1];

      return angular.element(element).scope().$eval(expression)
    }, element, expression);
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
  this.driver.executeScript('window.name += "' + DEFER_LABEL + '";' +
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
 * The Protractor Locator.
 * @augments webdriver.Locator.Strategy
 */
var ProtractorBy = function() {};
var WebdriverBy = function() {};

/**
 * webdriver's By is an enum of locator functions, so we must set it to
 * a prototype before inheriting from it.
 */
WebdriverBy.prototype = webdriver.By;
util.inherits(ProtractorBy, WebdriverBy);

/**
 * Usage:
 *   <span>{{status}}</span>
 *   var status = ptor.findElement(protractor.By.binding('{{status}}'));
 *
 * Note: This ignores parent element restrictions if called with
 * WebElement.findElement.
 */
ProtractorBy.prototype.binding = function(bindingDescriptor) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(webdriver.By.js(clientSideScripts.findBinding),
          using, bindingDescriptor);
    },
    findArrayOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findBindings),
          using, bindingDescriptor);
    }
  };
};

/**
 * Usage:
 * <select ng-model="user" ng-options="user.name for user in users"></select>
 * ptor.findElement(protractor.By.select("user"));
 */
ProtractorBy.prototype.select = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
        webdriver.By.js(clientSideScripts.findSelect), using, model);
    }
  };
};

ProtractorBy.prototype.selectedOption = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
        webdriver.By.js(clientSideScripts.findSelectedOption), using, model);
    }
  };
};

ProtractorBy.prototype.input = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
          webdriver.By.js(clientSideScripts.findInput), using, model);
    }
  };
};

/**
 * Usage:
 * <div ng-repeat = "cat in pets">
 *   <span>{{cat.name}}</span>
 *   <span>{{cat.age}}</span>
 * </div>
 *
 * // Returns the DIV for the second cat.
 * var secondCat = ptor.findElement(
 *     protractor.By.repeater("cat in pets").row(2));
 * // Returns the SPAN for the first cat's name.
 * var firstCatName = ptor.findElement(
 *     protractor.By.repeater("cat in pets").row(1).column("{{cat.name}}"));
 * // Returns an array of WebElements from a column
 * var ages = ptor.findElements(
 *     protractor.By.repeater("cat in pets").column("{{cat.age}}"));
 */
ProtractorBy.prototype.repeater = function(repeatDescriptor) {
  return {
    row: function(index) {
      return {
        findOverride: function(driver, using) {
          return driver.findElement(
              webdriver.By.js(clientSideScripts.findRepeaterRow),
              using, repeatDescriptor, index);
        },
        column: function(binding) {
          return {
            findOverride: function(driver, using) {
              return driver.findElement(
                  webdriver.By.js(clientSideScripts.findRepeaterElement),
                  using, repeatDescriptor, index, binding);
            }
          };
        }
      };
    },
    column: function(binding) {
      return {
        findArrayOverride: function(driver, using) {
          return driver.findElements(
              webdriver.By.js(clientSideScripts.findRepeaterColumn),
              using, repeatDescriptor, binding);
        }
      };
    }
  };
};

/**
 * @type {ProtractorBy}
 */
exports.By = new ProtractorBy();
