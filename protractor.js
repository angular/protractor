var util = require('util');

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

Protractor.prototype.waitForAngular = function() {
  return this.driver.executeAsyncScript(function() {
    var callback = arguments[arguments.length - 1];
    angular.element(document.body).injector().get('$browser').
    notifyWhenNoOutstandingRequests(callback);
  });
};

Protractor.prototype.findElement = function(locator, varArgs) {
  this.waitForAngular();
  return this.driver.findElement(locator, varArgs);
};

Protractor.prototype.addMockModule = function(name, script) {
  this.moduleNames_.push(name);
  this.moduleScripts_.push(script);
};

Protractor.prototype.clearMockModules = function() {
  this.moduleNames_ = [];
  this.moduleScripts_ = [];
};

Protractor.prototype.get = function(destination) {
  this.driver.get('about:blank');
  this.driver.executeScript('window.name += "' + DEFER_LABEL + '";' + 
      'window.location.href = "' + destination + '"');
      // At this point, Angular will pause for us, until angular.resumeBootstrap is called.

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

exports.wrapDriver = function(webdriver) {
  return new Protractor(webdriver);
};


/**
 * Locators.
 */
var ProtractorBy = function() {}
var WebdriverBy = function() {};
WebdriverBy.prototype = require('selenium-webdriver').By;

util.inherits(ProtractorBy, WebdriverBy);

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