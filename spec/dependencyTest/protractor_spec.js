// require('protractor') equivalent is requiring ptor
var protractor = require('../../built/main');

// the webdriver stuff we are exposing externally


describe('require(\'protractor\')', () => {

  describe('exported protractor classes', () => {
    it('should be defined', () => {
      var protractorClasses = ['ProtractorBrowser', 'ElementFinder', 'ElementArrayFinder',
        'ProtractorBy', 'ProtractorExpectedConditions'];
      for (var pos in protractorClasses) {
        var property = protractorClasses[pos];
        expect(typeof protractor[property]).toEqual('function');
      }
    });
    var seleniumClasses = ['ActionSequence', 'Browser', 'Builder', 'Button',
      'Capabilities', 'Capability', 'EventEmitter', 'FileDetector', 'Key',
      'Session', 'WebDriver', 'WebElement', 'WebElementPromise', 'Command',
      'CommandName'];
    for (var pos in seleniumClasses) {
      var propertyObj = seleniumClasses[pos];
      it('should have selenium-webdriver defined: ' + propertyObj, () => {
          expect(typeof protractor[propertyObj]).toEqual('object');
      });
    }

    it('should have selenium-webdriver promise.Promise', function() {
      expect(typeof protractor['promise']['Promise']).toEqual('function');
    });

    describe('browser class', () => {
      it('should have static method defined', () => {
        var staticMethod = 'wrapDriver';
        expect(typeof protractor.ProtractorBrowser['wrapDriver']).toEqual('function');
      });

      it('should have static variables defined', () => {
        var staticVariables = ['By', 'ExpectedConditions'];
        for (var pos in staticVariables) {
          var property = staticVariables[pos];
          expect(typeof protractor.ProtractorBrowser[property]).toEqual('object');
        }
      });
    });

  });

  describe('exported webdriver namespace', ()=> {
    it('should have exported classes', () => {
      var webdriverClasses = ['WebElement', 'ActionSequence', 'Command'];
      for (var pos in webdriverClasses) {
        var property = webdriverClasses[pos];
        expect(typeof protractor[property]).toEqual('function');
      }
    });

    it('should have variables defined', () => {
      var webdriverObjects = ['Key', 'CommandName'];
      for (var pos in webdriverObjects) {
        var property = webdriverObjects[pos];
        expect(typeof protractor[property]).toEqual('object');
      }
    });

    describe('promise namespace', () => {
      it('should have functions defined (spot check)', () => {
        var promiseFunctions = ['Promise', 'defer', 'delayed', 'createFlow',
          'controlFlow', 'all', 'fulfilled', 'filter', 'when' ]
        for (var pos in promiseFunctions) {
          var property = promiseFunctions[pos];
          expect(typeof protractor.promise[property]).toEqual('function');
        }
      });
    });
  });
});
