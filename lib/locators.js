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
 * Add a locator to this instance of ProtractorBy. This locator can then be
 * used with element(by.<name>(<args>)).
 *
 * @param {string} name
 * @param {function|string} script A script to be run in the context of
 *     the browser. This script will be passed an array of arguments
 *     that begins with the element scoping the search, and then
 *     contains any args passed into the locator. It should return
 *     an array of elements.
 */
ProtractorBy.prototype.addLocator = function(name, script) {
  this[name] = function(varArgs) {
    return {
      findElementsOverride: function(driver, using) {
        return driver.findElements(
          webdriver.By.js(script), using, varArgs);
      },
      message: 'by.' + name + '("' + varArgs + '")'
    }
  };
};

/**
 * Usage:
 *   <span>{{status}}</span>
 *   var status = element(by.binding('{{status}}'));
 */
ProtractorBy.prototype.binding = function(bindingDescriptor) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findBindings),
          using, bindingDescriptor);
    },
    message: 'by.binding("' + bindingDescriptor + '")'
  };
};

/**
 * Usage:
  * @DEPRECATED - use 'model' instead.
 *   <select ng-model="user" ng-options="user.name for user in users"></select>
 *   element(by.select("user"));
 */
ProtractorBy.prototype.select = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findSelects), using, model);
    },
    message: 'by.select("' + model + '")'
  };
};

/**
 * Usage:
 *   <select ng-model="user" ng-options="user.name for user in users"></select>
 *   element(by.selectedOption("user"));
 */
ProtractorBy.prototype.selectedOption = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findSelectedOptions), using, model);
    },
    message: 'by.selectedOption("' + model + '")'
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
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findInputs), using, model);
    },
    message: 'by.input("' + model + '")'
  };
};

/**
 * Usage:
 *   <input ng-model="user" type="text"/>
 *   element(by.model('user'));
 */
ProtractorBy.prototype.model = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findByModel), using, model);
    },
    message: 'by.model("' + model + '")'
  };
};

/**
 * @DEPRECATED - use 'model' instead.
 * Usage:
 *   <textarea ng-model="user"></textarea>
 *   element(by.textarea("user"));
 */
ProtractorBy.prototype.textarea = function(model) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
          webdriver.By.js(clientSideScripts.findTextareas), using, model);
    },
    message: 'by.textarea("' + model + '")'
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
 * var secondCat = element(by.repeater("cat in pets").row(1));
 * // Returns the SPAN for the first cat's name.
 * var firstCatName = element(
 *     by.repeater("cat in pets").row(0).column("{{cat.name}}"));
 * // Returns a promise that resolves to an array of WebElements from a column
 * var ages = element(
 *     by.repeater("cat in pets").column("{{cat.age}}"));
 * // Returns a promise that resolves to an array of WebElements containing
 * // all rows of the repeater.
 * var rows = element(by.repeater("cat in pets"));
 */
ProtractorBy.prototype.repeater = function(repeatDescriptor) {
  return {
    findElementsOverride: function(driver, using) {
      return driver.findElements(
        webdriver.By.js(clientSideScripts.findAllRepeaterRows),
        using, repeatDescriptor);
    },
    message: 'by.repeater("' + repeatDescriptor + '")',
    row: function(index) {
      return {
        findElementsOverride: function(driver, using) {
          return driver.findElements(
            webdriver.By.js(clientSideScripts.findRepeaterRows),
            using, repeatDescriptor, index);
        },
        message: 'by.repeater(' + repeatDescriptor + '").row("' + index + '")"',
        column: function(binding) {
          return {
            findElementsOverride: function(driver, using) {
              return driver.findElements(
                  webdriver.By.js(clientSideScripts.findRepeaterElement),
                  using, repeatDescriptor, index, binding);
            },
            message: 'by.repeater("' + repeatDescriptor + '").row("' + index +
                '").column("' + binding + '")'
          };
        }
      };
    },
    column: function(binding) {
      return {
        findElementsOverride: function(driver, using) {
          return driver.findElements(
              webdriver.By.js(clientSideScripts.findRepeaterColumn),
              using, repeatDescriptor, binding);
        },
        message: 'by.repeater("' + repeatDescriptor + '").column("' + binding +
            '")',
        row: function(index) {
          return {
            findElementsOverride: function(driver, using) {
              return driver.findElements(
                  webdriver.By.js(clientSideScripts.findRepeaterElement),
                  using, repeatDescriptor, index, binding);
            },
            message: 'by.repeater("' + repeatDescriptor + '").column("' +
                binding + '").row("' + index + '")'
          };
        }
      };
    }
  };
};

exports.ProtractorBy = ProtractorBy;
