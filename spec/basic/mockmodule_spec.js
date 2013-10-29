var util = require('util');

describe('mock modules', function() {
  // A module to override the 'version' service. This function will be
  // executed in the context of the application under test, so it may
  // not refer to any local variables.
  var mockModuleA = function() {
    var newModule = angular.module('moduleA', []);
    newModule.value('version', '2');
  };

  // A second module overriding the 'version' service. 
  // This module shows the use of a string for the load
  // function.
  // TODO(julie): Consider this syntax. Should we allow loading the
  // modules from files? Provide helpers?
  var mockModuleB = "angular.module('moduleB', []).value('version', '3');";

  afterEach(function() {
    browser.clearMockModules();
  });

  it('should override services via mock modules', function() {
    browser.addMockModule('moduleA', mockModuleA);

    browser.get('index.html');

    expect(element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should have the version of the last loaded module', function() {
    browser.addMockModule('moduleA', mockModuleA);
    browser.addMockModule('moduleB', mockModuleB);

    browser.get('index.html');

    expect(element(by.css('[app-version]')).getText()).toEqual('3');
  });
});
