var protractor = require('../lib/protractor.js');
var util = require('util');
require('../jasminewd');

describe('mock modules', function() {
  var ptor = protractor.getInstance();

  // A module to override the 'version' service. This function will be
  // executd in the context of the application under test, so it may
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
    ptor.clearMockModules();
  });

  it('should override services via mock modules', function() {
    ptor.addMockModule('moduleA', mockModuleA);

    ptor.get('app/index.html');

    ptor.findElement(protractor.By.css('[app-version]')).
        getText().then(function(text) {
          expect(text).toEqual('2');
        });
  });

  it('should have the version of the last loaded module', function() {
    ptor.addMockModule('moduleA', mockModuleA);
    ptor.addMockModule('moduleB', mockModuleB);

    ptor.get('app/index.html');

    ptor.findElement(protractor.By.css('[app-version]')).
        getText().then(function(text) {
          expect(text).toEqual('3');
        });
  });
});
