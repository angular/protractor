var fs = require('fs'),
    os = require('os'),
    path = require('path');
var BrowserError = require('../../../built/exitCodes').BrowserError;
var ProtractorError = require('../../../built/exitCodes').ProtractorError;
var Logger = require('../../../built/logger').Logger;
var WriteTo = require('../../../built/logger').WriteTo;
var Local = require('../../../built/driverProviders').Local;
var webdriver, file;

describe('local connect', function() {
  beforeEach(function() {
    ProtractorError.SUPRESS_EXIT_CODE = true;
    Logger.setWrite(WriteTo.NONE);
  });

  afterEach(function() {
    ProtractorError.SUPRESS_EXIT_CODE = false;
    Logger.setWrite(WriteTo.CONSOLE);
  });

  describe('without the selenium standalone jar', function() {
    it('should throw an error jar file is not present', function() {
      var config = {
        capabilities: { browserName: 'chrome' },
        seleniumServerJar: '/foo/bar/selenium.jar'
      };
      var errorFound = false;
      try {
        webdriver = new Local(config);
        webdriver.setupEnv();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  describe('with the selenium standalone jar', function() {
    it('should throw an error if the jar file does not work', function() {
      var jarFile = '';
      beforeEach(function() {
        // add files to selenium folder
        file = 'selenium.jar';
        jarFile = path.resolve(os.tmpdir(), file);
        fs.openSync(jarFile, 'w');
      });

      afterEach(function() {
        try {
          fs.unlinkSync(jarFile);
        } catch(e) {
        }
      });

      it('should throw an error if the selenium sever jar cannot be used', function() {
        var config = {
          capabilities: { browserName: 'foobar explorer' },
          seleniumServerJar: jarFile
        };
        var errorFound = false;
        try {
          webdriver = new Local(config);
          webdriver.getNewDriver();
        } catch(e) {
          errorFound = true;
          expect(e.code).toBe(BrowserError.CODE);
        }
        expect(errorFound).toBe(true);
      });
    });
  });

  describe('binary does not exist', () => {
    it('should throw an error if the update-config.json does not exist', () => {
      spyOn(fs, 'readFileSync').and.callFake(() => { return null; });
      var config = {
        capabilities: { browserName: 'chrome' },
        openSync: fs.openSync
      };
      var errorFound = false;
      try {
        webdriver = new Local(config);
        webdriver.setupDriverEnv();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });
});
