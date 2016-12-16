var protractor = require('../../built/index');

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

    it('should have selenium-webdriver functions defined', () => {
      var seleniumFunctions = ['ActionSequence', 'Builder',
        'Capabilities', 'Command', 'EventEmitter', 'FileDetector',
        'Session', 'WebDriver', 'WebElement', 'WebElementPromise'];
      for (var pos in seleniumFunctions) {
        var propertyObj = seleniumFunctions[pos];
        expect(typeof protractor[propertyObj]).toEqual('function');
      }
    });

    it('should have selenium-webdriver objects defined', () => {
      var seleniumObjects = ['Browser', 'Button', 'Capability', 'CommandName', 'Key'];
      for (var pos in seleniumObjects) {
        var propertyObj = seleniumObjects[pos];
        expect(typeof protractor[propertyObj]).toEqual('object');
      }
    });


    it('should have selenium-webdriver promise.Promise', function() {
      expect(typeof protractor['promise']['Promise']).toEqual('function');
    });

    describe('browser class', () => {
      it('should have static variables defined', () => {
        var staticVariables = ['By'];
        for (var pos in staticVariables) {
          var property = staticVariables[pos];
          expect(typeof protractor.ProtractorBrowser[property]).toEqual('object');
        }
      });
    });
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
