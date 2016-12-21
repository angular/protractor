/*
 *  This is an implementation of the Direct Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as q from 'q';
import {Capabilities, WebDriver} from 'selenium-webdriver';
import {Driver as ChromeDriver, ServiceBuilder as ChromeServiceBuilder} from 'selenium-webdriver/chrome';
import {Driver as FirefoxDriver} from 'selenium-webdriver/firefox';

import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

const SeleniumConfig = require('webdriver-manager/built/lib/config').Config;

let logger = new Logger('direct');
export class Direct extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

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
            logger,
            'browserName ' + this.config_.capabilities.browserName +
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
  getNewDriver(): WebDriver {
    let driver: WebDriver;
    let updateJson = path.resolve(SeleniumConfig.getSeleniumDir(), 'update-config.json');
    let updateConfig = JSON.parse(fs.readFileSync(updateJson).toString());

    switch (this.config_.capabilities.browserName) {
      case 'chrome':
        let defaultChromeDriverPath = updateConfig.chrome.last;
        let chromeDriverFile = this.config_.chromeDriver || defaultChromeDriverPath;

        if (!fs.existsSync(chromeDriverFile)) {
          throw new BrowserError(
              logger,
              'Could not find chromedriver at ' + chromeDriverFile +
                  '. Run \'webdriver-manager update\' to download binaries.');
        }

        let chromeService = new ChromeServiceBuilder(chromeDriverFile).build();
        driver = ChromeDriver.createSession(new Capabilities(this.config_.capabilities), chromeService);
        break;
      case 'firefox':
        if (this.config_.firefoxPath) {
          this.config_.capabilities['firefox_binary'] = this.config_.firefoxPath;
        }

        // TODO(cnishina): Add in a service builder with marionette. Direct connect
        // currently supports FF legacy version 47.
        driver =
            FirefoxDriver.createSession(new Capabilities(this.config_.capabilities));
        break;
      default:
        throw new BrowserError(
            logger,
            'browserName ' + this.config_.capabilities.browserName +
                ' is not supported with directConnect.');
    }
    this.drivers_.push(driver);
    return driver;
  }
}
