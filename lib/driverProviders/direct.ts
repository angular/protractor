/*
 *  This is an implementation of the Direct Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as fs from 'fs';
import {Capabilities, WebDriver} from 'selenium-webdriver';
import {Driver as DriverForChrome, ServiceBuilder as ServiceBuilderForChrome} from 'selenium-webdriver/chrome';
import {Driver as DriverForFirefox, ServiceBuilder as SerivceBuilderForFirefox} from 'selenium-webdriver/firefox';

import {ChromeDriver, GeckoDriver} from 'webdriver-manager';

import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let logger = new Logger('direct');
export class Direct extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {Promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected async setupDriverEnv(): Promise<any> {
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
  }

  /**
   * Create a new driver.
   *
   * @public
   * @override
   * @return webdriver instance
   */
  async getNewDriver(): Promise<WebDriver> {
    let driver: WebDriver;

    switch (this.config_.capabilities.browserName) {
      case 'chrome':
        let chromeDriverFile: string;
        if (this.config_.chromeDriver) {
          chromeDriverFile = this.config_.chromeDriver;
        } else {
          try {
            chromeDriverFile = new ChromeDriver().getBinaryPath();
          } catch (e) {
            throw new BrowserError(
                logger, 'Run \'webdriver-manager update\' to download binaries.');
          }
        }

        if (!fs.existsSync(chromeDriverFile)) {
          throw new BrowserError(
              logger,
              'Could not find chromedriver at ' + chromeDriverFile +
                  '. Run \'webdriver-manager update\' to download binaries.');
        }

        const chromeService =
            (new ServiceBuilderForChrome(chromeDriverFile) as ServiceBuilderForChrome).build();
        driver = await DriverForChrome.createSession(
            new Capabilities(this.config_.capabilities), chromeService);
        break;
      case 'firefox':
        let geckoDriverFile: string;
        if (this.config_.geckoDriver) {
          geckoDriverFile = this.config_.geckoDriver;
        } else {
          try {
            geckoDriverFile = new GeckoDriver().getBinaryPath();
          } catch (e) {
            throw new BrowserError(
                logger, 'Run \'webdriver-manager update\' to download binaries.');
          }
        }

        if (!fs.existsSync(geckoDriverFile)) {
          throw new BrowserError(
              logger,
              'Could not find geckodriver at ' + geckoDriverFile +
                  '. Run \'webdriver-manager update\' to download binaries.');
        }

        let firefoxService = new SerivceBuilderForFirefox(geckoDriverFile).build();
        driver = await DriverForFirefox.createSession(
            new Capabilities(this.config_.capabilities), firefoxService);
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
