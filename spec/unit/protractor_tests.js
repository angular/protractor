var Protractor = require('../../lib/protractor');

describe('Protractor', function () {

  var protractor, webDriver, loadedModules;

  beforeEach(function () {

    loadedModules = [];

    webDriver = {
      get: function(){},
      wait: function(cb){ cb(); },
      executeAsyncScript: function(){ return { then: function(cb){ cb([true]); }}; },
      executeScript: function(script){

        switch(script) {
          case 'return window.location.href;':
            return { then: function(cb){ cb('index.html'); }};
          case 'window.name = "NG_DEFER_BOOTSTRAP!" + window.name;window.location.replace("index.html");':
          case 'angular.resumeBootstrap(arguments[0]);':
            return { then: function(cb){ cb(); }};
          default:
            //this should all be calls to load modules.
            loadedModules.push(script);
            return { then: function(cb){ }};
        }

    }};

    protractor = Protractor.wrapDriver(webDriver, '', '');

  });

  describe('when two modules with the same name are added', function () {

    beforeEach(function () {
      protractor.addMockModule('moduleA', 'first-module');
      protractor.addMockModule('moduleA', 'last-module');
      protractor.get('index.html');
    });

    it('should only load one module', function () {
      expect(loadedModules.length).toEqual(1);
    });

    it('should load the last module added', function () {
      expect(loadedModules[0]).toEqual('last-module');
    });

  });

  describe('when two modules with the same name are added and then removed (once)', function () {

    beforeEach(function () {
      protractor.addMockModule('moduleA', 'first-module');
      protractor.addMockModule('moduleA', 'last-module');
      protractor.removeMockModule('moduleA');
      protractor.get('index.html');
    });

    it('should not load either module', function () {
      expect(loadedModules.length).toEqual(0);
    });

  });

  describe('when a module is removed that was never added', function () {

    beforeEach(function () {
      protractor.addMockModule('moduleA', 'first-module');
      protractor.removeMockModule('moduleB');
      protractor.get('index.html');
    });

    it('should load all registered modules', function () {
      expect(loadedModules.length).toEqual(1);
    });

    it('should load the last module registered', function () {
      expect(loadedModules[0]).toEqual('first-module');
    });

  });

});