var fs = require('fs'),
    os = require('os'),
    path = require('path');
var BrowserError = require('../../../built/exitCodes').BrowserError;
var ProtractorError = require('../../../built/exitCodes').ProtractorError;
var Logger = require('../../../built/logger').Logger;
var WriteTo = require('../../../built/logger').WriteTo;
var Direct = require('../../../built/driverProviders').Direct;
var webdriver, file;

describe('direct connect', function() {
  beforeEach(function() {
    ProtractorError.SUPRESS_EXIT_CODE = true;
    Logger.setWrite(WriteTo.NONE);
  });

  afterEach(function() {
    ProtractorError.SUPRESS_EXIT_CODE = false;
    Logger.setWrite(WriteTo.CONSOLE);
  });

  describe('without the chrome driver', function() {
    it('should throw an error if no drivers are present', function() {
      var config = {
        directConnect: true,
        capabilities: { browserName: 'chrome' },
        chromeDriver: '/foo/bar/chromedriver'
      };
      var errorFound = false;
      try {
        webdriver = new Direct(config);
        webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  describe('with chromedriver drivers', function() {
    var chromedriver = '';
    beforeEach(function() {
      // add files to selenium folder
      file = 'chromedriver';
      chromedriver = path.resolve(os.tmpdir(), file);
      fs.openSync(chromedriver, 'w');
    });

    afterEach(function() {
      try {
        fs.unlinkSync(chromedriver);
      } catch(e) {
      }
    });

    it('should throw an error if the driver cannot be used', function() {
      var config = {
        directConnect: true,
        capabilities: { browserName: 'foobar explorer' },
        chromeDriver: chromedriver
      };
      var errorFound = false;
      try {
        webdriver = new Direct(config);
        webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  describe('binary does not exist', () => {
    it('should throw an error if the update-config.json does not exist', () => {
      spyOn(fs, 'readFileSync').and.callFake(() => { return null; });
      var config = {
        directConnect: true,
        capabilities: { browserName: 'chrome' },
      };
      var errorFound = false;
      try {
        webdriver = new Direct(config);
        webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });
});
