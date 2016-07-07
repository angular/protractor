/*
 *  This is an implementation of the Direct Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as q from 'q';
import * as util from 'util';

import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let webdriver = require('selenium-webdriver'),
    chrome = require('selenium-webdriver/chrome'),
    firefox = require('selenium-webdriver/firefox');
let SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
let SeleniumChrome =
    require('webdriver-manager/built/lib/binaries/chrome_driver').ChromeDriver;
let SeleniumStandAlone =
    require('webdriver-manager/built/lib/binaries/stand_alone').StandAlone;


let logger = new Logger('direct');
export class Direct extends DriverProvider {
  constructor(config: Config) { super(config); }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  setupEnv(): q.Promise<any> {
    switch (this.config_.capabilities.browserName) {
      case 'chrome':
        logger.info('Using ChromeDriver directly...');
        break;
      case 'firefox':
        logger.info('Using FirefoxDriver directly...');
        break;
      default:
        throw new BrowserError(
            logger, 'browserName ' + this.config_.capabilities.browserName +
                ' is not supported with directConnect.');
    }
    return q.fcall(function() {});
  }

  /**
   * Create a new driver.
   *
   * @public
   * @override
   * @return webdriver instance
   */
  getNewDriver(): webdriver.WebDriver {
    let driver: webdriver.WebDriver;
    switch (this.config_.capabilities.browserName) {
      case 'chrome':
        let defaultChromeDriverPath = path.resolve(
            SeleniumConfig.getSeleniumDir(),
            new SeleniumChrome().executableFilename());

        if (process.platform.indexOf('win') === 0) {
          defaultChromeDriverPath += '.exe';
        }

        let chromeDriverFile =
            this.config_.chromeDriver || defaultChromeDriverPath;

        if (!fs.existsSync(chromeDriverFile)) {
          throw new BrowserError(
              logger, 'Could not find chromedriver at ' + chromeDriverFile);
        }

        let service = new chrome.ServiceBuilder(chromeDriverFile).build();
        driver = new chrome.Driver(
            new webdriver.Capabilities(this.config_.capabilities), service);
        break;
      case 'firefox':
        if (this.config_.firefoxPath) {
          this.config_.capabilities['firefox_binary'] =
              this.config_.firefoxPath;
        }
        driver = new firefox.Driver(this.config_.capabilities);
        break;
      default:
        throw new BrowserError(
            logger, 'browserName ' + this.config_.capabilities.browserName +
                ' is not supported with directConnect.');
    }
    this.drivers_.push(driver);
    return driver;
  }
}
