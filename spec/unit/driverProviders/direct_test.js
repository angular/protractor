const fs = require('fs'),
    os = require('os'),
    path = require('path');
const BrowserError = require('../../../built/exitCodes').BrowserError;
const ProtractorError = require('../../../built/exitCodes').ProtractorError;
const Logger = require('../../../built/logger').Logger;
const WriteTo = require('../../../built/logger').WriteTo;
const Direct = require('../../../built/driverProviders').Direct;
let webdriver, file;

describe('direct connect', () => {
  beforeEach(() => {
    ProtractorError.SUPRESS_EXIT_CODE = true;
    Logger.setWrite(WriteTo.NONE);
  });

  afterEach(() => {
    ProtractorError.SUPRESS_EXIT_CODE = false;
    Logger.setWrite(WriteTo.CONSOLE);
  });

  describe('without the chrome driver', () => {
    it('should throw an error if no drivers are present', async () => {
      const config = {
        directConnect: true,
        capabilities: { browserName: 'chrome' },
        chromeDriver: '/foo/bar/chromedriver'
      };
      let errorFound = false;
      try {
        webdriver = new Direct(config);
        await webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  describe('with chromedriver drivers', () => {
    let chromedriver = '';
    beforeEach(() => {
      // add files to selenium folder
      file = 'chromedriver';
      chromedriver = path.resolve(os.tmpdir(), file);
      fs.openSync(chromedriver, 'w');
    });

    afterEach(() => {
      try {
        fs.unlinkSync(chromedriver);
      } catch(e) {
      }
    });

    it('should throw an error if the driver cannot be used', async () => {
      const config = {
        directConnect: true,
        capabilities: { browserName: 'foobar explorer' },
        chromeDriver: chromedriver
      };
      let errorFound = false;
      try {
        webdriver = new Direct(config);
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
        directConnect: true,
        capabilities: { browserName: 'chrome' },
      };
      let errorFound = false;
      try {
        webdriver = new Direct(config);
        await webdriver.getNewDriver();
      } catch(e) {
        errorFound = true;
        expect(e.code).toBe(BrowserError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });
});
