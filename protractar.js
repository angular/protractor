var url = require('url');
var util = require('util');

exports.wrapDriver = function(webdriver) {
  // should this delegate to all functions on the webdriver? Should it
  // actually modify the input driver? 
  var driver = webdriver,
      moduleNames = [],
      moduleScripts = [];

  var PROTRACTAR_URL_LABEL = '_WAITFORMODULES';

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
     * protractar.addMockModule(moduleA);
     * protractar.addMockModule(moduleB);
     * protractar.get('foo.com'); 
     */
    get: function(destination) {
      var parsed = url.parse(destination);
      parsed.hash = (parsed.hash ? parsed.hash : '#') + PROTRACTAR_URL_LABEL;
      var modifiedUrl = url.format(parsed);
      driver.get(modifiedUrl);
      // At this point, Angular will pause for us, until angular.loadExtraModules is called.

      for (var i = 0; i < moduleScripts.length; ++i) {
	driver.executeScript(moduleScripts[i]); // Should this be async?
      }

      driver.executeAsyncScript(function() {
	var callback = arguments[arguments.length - 1];
	// Continue to bootstrap Angular.
	angular.loadExtraModules(arguments[0]);
	callback();
      }, moduleNames);
    }
  };
};

exports.By = {
  binding: 0,
  select: 1,
  repeater: 2,
  input: 3
};
