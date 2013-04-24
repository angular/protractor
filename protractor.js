var url = require('url');
var util = require('util');

exports.wrapDriver = function(webdriver) {
  // should this delegate to all functions on the webdriver? Should it
  // actually modify the input driver? 
  var driver = webdriver,
      moduleNames = [],
      moduleScripts = [];

  var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';

  var waitForAngular = function() {
    return driver.executeAsyncScript(function() {
      var callback = arguments[arguments.length - 1];
      angular.element(document.body).injector().get('$browser').
	  notifyWhenNoOutstandingRequests(callback);
    });
  }; 

  return {
    findElement: function(locator, varArgs) {
      waitForAngular();
      return driver.findElement(locator, varArgs);
    },

    /**
     * @param <string> name
     * @param <Function|string> script
     */
    addMockModule: function(name, script) {
      moduleNames.push(name);
      moduleScripts.push(script);
    },

    clearMockModules: function() {
      moduleNames = [];
      moduleScripts = [];
    },

    /**
     * Usage: 
     * protractor.addMockModule(moduleA);
     * protractor.addMockModule(moduleB);
     * protractor.get('foo.com'); 
     */
    get: function(destination) {
      driver.get('about:blank');
      driver.executeScript('window.name += "' + DEFER_LABEL + '";' + 
			   'window.location.href = "' + destination + '"');
      // At this point, Angular will pause for us, until angular.resumeBootstrap is called.

      for (var i = 0; i < moduleScripts.length; ++i) {
	driver.executeScript(moduleScripts[i]); // Should this be async?
      }

      driver.executeAsyncScript(function() {
	var callback = arguments[arguments.length - 1];
	// Continue to bootstrap Angular.
	angular.resumeBootstrap(arguments[0]);
	callback();
      }, moduleNames);
    }
  };
};

var By = function() {}
var ByWrapper = function() {};
ByWrapper.prototype = require('selenium-webdriver').By;

util.inherits(By, ByWrapper);

By.prototype.binding = function() {
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

By.prototype.select = function(model) {
  return {
    using: 'css selector',
    value: 'select[ng-model=' + model + ']'
  };
};

By.prototype.selectedOption = function(model) {
  return {
    using: 'css selector',
    value: 'select[ng-model=' + model + '] option[selected]'
  };
};

By.prototype.input = function(model) {
  return {
    using: 'css selector',
    value: 'input[ng-model=' + model + ']'
  };
}
By.prototype.repeater = null;

exports.By = new By();