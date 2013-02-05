var url = require('url');
var util = require('util');

exports.wrapDriver = function(webdriver) {
  // should this delegate to all functions on the webdriver? Should it
  // actually modify the input driver? 
  var driver = webdriver,
      moduleNames = [],
      moduleScripts = [];

  var PROTRACTOR_URL_LABEL = '_WAITFORMODULES';

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
      var parsed = url.parse(destination);
      parsed.hash = (parsed.hash ? parsed.hash : '#') + PROTRACTOR_URL_LABEL;
      var modifiedUrl = url.format(parsed);
      driver.get(modifiedUrl);
      // At this point, Angular will pause for us, until angular.resumeBootstrapWithExtraModules is called.

      for (var i = 0; i < moduleScripts.length; ++i) {
	driver.executeScript(moduleScripts[i]); // Should this be async?
      }

      driver.executeAsyncScript(function() {
	var callback = arguments[arguments.length - 1];
	// Continue to bootstrap Angular.
	angular.resumeBootstrapWithExtraModules(arguments[0]);
	callback();
      }, moduleNames);
    }
  };
};

exports.By = {
  /** Usage: 
   * driver.findElement(protractor.By.binding(), "{{myBinding}}");
   */
  binding: function() {
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
  },
  select: function() {
    return {
      using: 'css',
      value: ''
    };
  },
  repeater: 2,
  input: 3
};
