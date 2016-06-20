var fs = require('fs'),
    os = require('os'),
    path = require('path');
var BrowserError = require('../../../built/exitCodes').BrowserError,
    Logger = require('../../../built/logger2').Logger,
    WriteTo = require('../../../built/logger2').WriteTo;

describe('local connect', function() {
  beforeEach(function() {
    Logger.setWrite(WriteTo.NONE);
  });

  afterEach(function() {
    Logger.setWrite(WriteTo.CONSOLE);
  });

  describe('without the selenium standalone jar', function() {
    it('should throw an error jar file is not present', function() {
      var config = {
        directConnect: true,
        capabilities: { browserName: 'chrome' },
        seleniumServerJar: '/foo/bar/selenium.jar'
      };
      var errorFound = false;
      try {
        webdriver = require('../../../built/driverProviders/local')(config);
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
          directConnect: true,
          capabilities: { browserName: 'foobar explorer' },
          seleniumServerJar: jarFile
        };
        var errorFound = false;
        try {
          webdriver = require('../../../built/driverProviders/local')(config);
          webdriver.getNewDriver();
        } catch(e) {
          errorFound = true;
          expect(e.code).toBe(BrowserError.CODE);
        }
        expect(errorFound).toBe(true);
      });
    });
  });
});
