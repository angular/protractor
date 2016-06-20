var fs = require('fs'),
    os = require('os'),
    path = require('path');
var BrowserError = require('../../../built/exitCodes').BrowserError,
    Logger = require('../../../built/logger2').Logger,
    WriteTo = require('../../../built/logger2').WriteTo;

describe('direct connect', function() {
  beforeEach(function() {
    Logger.setWrite(WriteTo.NONE);
  });

  afterEach(function() {
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
        webdriver = require('../../../built/driverProviders/direct')(config);
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
        webdriver = require('../../../built/driverProviders/direct')(config);
        webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });
});
