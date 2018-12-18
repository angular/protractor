const fs = require('fs'),
    os = require('os'),
    path = require('path');
const BrowserError = require('../../../built/exitCodes').BrowserError;
const ProtractorError = require('../../../built/exitCodes').ProtractorError;
const Logger = require('../../../built/logger').Logger;
const WriteTo = require('../../../built/logger').WriteTo;
const Local = require('../../../built/driverProviders').Local;
let webdriver, file;

describe('local connect', () => {
  beforeEach(() => {
    ProtractorError.SUPRESS_EXIT_CODE = true;
    Logger.setWrite(WriteTo.NONE);
  });

  afterEach(() => {
    ProtractorError.SUPRESS_EXIT_CODE = false;
    Logger.setWrite(WriteTo.CONSOLE);
  });

  describe('without the selenium standalone jar', () => {
    it('should throw an error jar file is not present', async () => {
      const config = {
        capabilities: { browserName: 'chrome' },
        seleniumServerJar: '/foo/bar/selenium.jar'
      };
      let errorFound = false;
      try {
        webdriver = new Local(config);
        await webdriver.setupEnv();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  describe('with the selenium standalone jar', () => {
    it('should throw an error if the selenium sever jar cannot be used', async () => {
      let jarFile = '';
      const config = {
        capabilities: { browserName: 'foobar explorer' },
        seleniumServerJar: jarFile
      };
      let errorFound = false;
      try {
        webdriver = new Local(config);
        await webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  describe('binary does not exist', () => {
    it('should throw an error if the update-config.json does not exist', async () => {
      spyOn(fs, 'readFileSync').and.callFake(() => { return null; });
      const config = {
        capabilities: { browserName: 'chrome' },
        openSync: fs.openSync
      };
      let errorFound = false;
      try {
        webdriver = new Local(config);
        await webdriver.setupDriverEnv();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });
});
