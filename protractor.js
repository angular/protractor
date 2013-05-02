var util = require('util');
var webdriver = require('selenium-webdriver');

var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';
/**
 * @param {webdriver.WebDriver} webdriver
 * @constructor
 */
var Protractor = function(webdriver) {
  this.driver = webdriver;

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
  return this.driver.executeAsyncScript(function() {
    var callback = arguments[arguments.length - 1];
    angular.element(document.body).injector().get('$browser').
        notifyWhenNoOutstandingRequests(callback);
  });
};

/**
 * See webdriver.WebDriver.findElement
 *
 * Waits for Angular to finish rendering before searching for elements.
 */
Protractor.prototype.findElement = function(locator, varArgs) {
  this.waitForAngular();
  return this.driver.findElement(locator, varArgs);
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
  this.driver.get('about:blank');
  this.driver.executeScript('window.name += "' + DEFER_LABEL + '";' + 
      'window.location.href = "' + destination + '"');
  // At this point, Angular will pause for us, until angular.resumeBootstrap
  // is called.

  for (var i = 0; i < this.moduleScripts_.length; ++i) {
    this.driver.executeScript(this.moduleScripts_[i]);
  }

  this.driver.executeAsyncScript(function() {
    var callback = arguments[arguments.length - 1];
    // Continue to bootstrap Angular.
    angular.resumeBootstrap(arguments[0]);
    callback();
  }, this.moduleNames_);
};

/**
 * Create a new instance of Protractor by wrapping a webdriver instance.
 *
 * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
 */
exports.wrapDriver = function(webdriver) {
  return new Protractor(webdriver);
};


/**
 * Locators.
 */
var ProtractorBy = function() {}
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
 *   var status = ptor.findElement(protractor.By.binding(), '{{status}}');
 *
 * Note: The name of the binding should be the second argument to
 * findElement, NOT an argument to binding().
 * TODO(juliemr): This is confusing, can we get around it?
 */
ProtractorBy.prototype.binding = function() {
  return {
    using: 'js',
    value: function() {
      var bindings = document.getElementsByClassName('ng-binding');
      var matches = [];
      var binding = arguments[0];
      for (var i = 0; i < bindings.length; ++i) {
        if (angular.element(bindings[i]).data().$binding[0].exp == binding) {
          matches.push(bindings[i]);
        }
      }
      
      return matches[0]; // We can only return one with webdriver.findElement.
    }
  };
};

ProtractorBy.prototype.select = function(model) {
  return {
    using: 'css selector',
    value: 'select[ng-model=' + model + ']'
  };
};

ProtractorBy.prototype.selectedOption = function(model) {
  return {
    using: 'css selector',
    value: 'select[ng-model=' + model + '] option[selected]'
  };
};

ProtractorBy.prototype.input = function(model) {
  return {
    using: 'css selector',
    value: 'input[ng-model=' + model + ']'
  };
};

ProtractorBy.prototype.repeater = null;

exports.By = new ProtractorBy();