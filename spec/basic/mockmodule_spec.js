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
  var mockModuleB = "angular.module('moduleB', []).value('version', '3');";

  // A third module overriding the 'version' service. This function
  // references the additional arguments provided through addMockModule().
  var mockModuleC = function () {
    var newModule = angular.module('moduleC', []);
    newModule.value('version', arguments[0] + arguments[1]);
  };

  afterEach(function() {
    browser.clearMockModules('index.html');
  });

  it('should override services via mock modules', function() {
    browser.addMockModule('moduleA', mockModuleA, 'index.html');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should have the version of the last loaded module', function() {
    browser.addMockModule('moduleA', mockModuleA, 'index.html');
    browser.addMockModule('moduleB', mockModuleB, 'index.html');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('3');
  });

  it('should use the latest module if two are added with the same name', function() {
    browser.addMockModule('moduleA', mockModuleA, 'index.html');

    var mockModuleA2 = function() {
      var newModule = angular.module('moduleA', []);
      newModule.value('version', '3');
    };

    browser.addMockModule('moduleA', mockModuleA2, 'index.html');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('3');
  });

  it('should have the version of the module A after deleting module B', function() {
    browser.addMockModule('moduleA', mockModuleA, 'index.html');
    browser.addMockModule('moduleB', mockModuleB, 'index.html');
    browser.removeMockModule('moduleB', 'index.html');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should be a noop to remove a module which does not exist', function() {
    browser.addMockModule('moduleA', mockModuleA, 'index.html');
    browser.removeMockModule('moduleB', 'index.html');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should have the version provided from parameters through Module C', function() {
    browser.addMockModule('moduleC', mockModuleC, 'index.html', '42', 'beta');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('42beta');
  });

  it('should load mock modules after refresh', function() {
    browser.addMockModule('moduleA', mockModuleA, 'index.html');

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('2');

    browser.refresh();
    expect(element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should load mock modules after navigating back and forward', function() {
    browser.getCapabilities().then(function(caps) {
      if (caps.get('browserName') === 'safari') {
        // Safari can't handle navigation. Ignore this test.
        return;
      } else {
        browser.addMockModule('moduleA', mockModuleA, 'index.html');
        
        browser.get('index.html');
        expect(element(by.css('[app-version]')).getText()).toEqual('2');

        browser.get('index.html#/repeater');
        expect(element(by.css('[app-version]')).getText()).toEqual('2');

        browser.back();
        expect(element(by.css('[app-version]')).getText()).toEqual('2');

        browser.forward();
        expect(element(by.css('[app-version]')).getText()).toEqual('2');
      }
    });
  });

  it('should load mock modules after navigating back and forward from link', function() {
    browser.getCapabilities().then(function(caps) {
      if (caps.get('browserName') === 'safari') {
        // Safari can't handle navigation. Ignore this test.
        return;
      } else {
        browser.addMockModule('moduleA', mockModuleA, 'index.html');

        browser.get('index.html');
        expect(element(by.css('[app-version]')).getText()).toEqual('2');

        element(by.linkText('repeater')).click();
        expect(element(by.css('[app-version]')).getText()).toEqual('2');

        browser.back();
        expect(element(by.css('[app-version]')).getText()).toEqual('2');

        browser.forward();
        expect(element(by.css('[app-version]')).getText()).toEqual('2');
      }
    });
  });
});
