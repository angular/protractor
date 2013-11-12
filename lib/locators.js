var util = require('util');
var webdriver = require('selenium-webdriver');

var clientSideScripts = require('./clientsidescripts.js');

/**
 * The Protractor Locators. These provide ways of finding elements in
 * Angular applications by binding, model, etc.
 *
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
 *   var status = element(by.binding('{{status}}'));
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
 *   <select ng-model="user" ng-options="user.name for user in users"></select>
 *   element(by.select("user"));
 */
ProtractorBy.prototype.select = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
        webdriver.By.js(clientSideScripts.findSelect), using, model);
    },
    findArrayOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findSelects), using, model);
    }
  };
};

/**
 * Usage:
 *   <select ng-model="user" ng-options="user.name for user in users"></select>
 *   element(by.selectedOption("user"));
 */
ProtractorBy.prototype.selectedOption = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
        webdriver.By.js(clientSideScripts.findSelectedOption), using, model);
    },
    findArrayOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findSelectedOptions), using, model);
    }
  };
};

/**
 * @DEPRECATED - use 'model' instead.
 * Usage:
 *   <input ng-model="user" type="text"/>
 *   element(by.input('user'));
 */
ProtractorBy.prototype.input = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
          webdriver.By.js(clientSideScripts.findInput), using, model);
    },
    findArrayOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findInputs), using, model);
    }
  };
};

/**
 * Usage:
 *   <input ng-model="user" type="text"/>
 *   element(by.model('user'));
 */
ProtractorBy.prototype.model = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
          webdriver.By.js(clientSideScripts.findInput), using, model);
    },
    findArrayOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findInputs), using, model);
    }
  };
};

/**
 * Usage:
 *   <textarea ng-model="user"></textarea>
 *   element(by.textarea("user"));
 */
ProtractorBy.prototype.textarea = function(model) {
  return {
    findOverride: function(driver, using) {
      return driver.findElement(
          webdriver.By.js(clientSideScripts.findTextarea), using, model);
    }
  };
};

/**
 * Usage:
 *   <div ng-repeat = "cat in pets">
 *     <span>{{cat.name}}</span>
 *     <span>{{cat.age}}</span>
 *   </div>
 *
 * // Returns the DIV for the second cat.
 * var secondCat = element(by.repeater("cat in pets").row(2));
 * // Returns the SPAN for the first cat's name.
 * var firstCatName = element(
 *     by.repeater("cat in pets").row(1).column("{{cat.name}}"));
 * // Returns a promise that resolves to an array of WebElements from a column
 * var ages = element(
 *     by.repeater("cat in pets").column("{{cat.age}}"));
 * // Returns a promise that resolves to an array of WebElements containing
 * // all rows of the repeater.
 * var rows = element(by.repeater("cat in pets"));
 */
ProtractorBy.prototype.repeater = function(repeatDescriptor) {
  return {
    findArrayOverride: function(driver, using) {
      return driver.findElements(
        webdriver.By.js(clientSideScripts.findAllRepeaterRows),
        using, repeatDescriptor);
    },
    row: function(index) {
      return {
        findOverride: function(driver, using) {
          return driver.findElement(
              webdriver.By.js(clientSideScripts.findRepeaterRow),
              using, repeatDescriptor, index);
        },
        findArrayOverride: function(driver, using) {
          return driver.findElements(
            webdriver.By.js(clientSideScripts.findRepeaterRows),
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
        },
        row: function(index) {
          return {
            findOverride: function(driver, using) {
              return driver.findElement(
                  webdriver.By.js(clientSideScripts.findRepeaterElement),
                  using, repeatDescriptor, index, binding);
            }
          };
        }
      };
    }
  };
};

exports.ProtractorBy = ProtractorBy;
