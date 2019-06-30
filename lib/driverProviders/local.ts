/*
 * This is an implementation of the Local Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 *
 * TODO - it would be nice to do this in the launcher phase,
 * so that we only start the local selenium once per entire launch.
 */
import * as fs from 'fs';
import {SeleniumServer} from 'selenium-webdriver/remote';
import {ChromeDriver, GeckoDriver, SeleniumServer as WdmSeleniumServer} from 'webdriver-manager';

import {Config} from '../config';
import {BrowserError, ConfigError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let logger = new Logger('local');

export class Local extends DriverProvider {
  server_: SeleniumServer;
  constructor(config: Config) {
    super(config);
    this.server_ = null;
  }

  /**
   * Helper to locate the default jar path if none is provided by the user.
   * @private
   */
  addDefaultBinaryLocs_(): void {
    if (!this.config_.seleniumServerJar) {
      logger.debug(
          'Attempting to find the SeleniumServerJar in the default ' +
          'location used by webdriver-manager');
      try {
        this.config_.seleniumServerJar = new WdmSeleniumServer().getBinaryPath();
      } catch (err) {
        throw new BrowserError(logger, 'Run \'webdriver-manager update\' to download binaries.');
      }
    }
    if (!fs.existsSync(this.config_.seleniumServerJar)) {
      throw new BrowserError(
          logger,
          'No selenium server jar found at ' + this.config_.seleniumServerJar +
              '. Run \'webdriver-manager update\' to download binaries.');
    }
    if (this.config_.capabilities.browserName === 'chrome') {
      if (!this.config_.chromeDriver) {
        logger.debug(
            'Attempting to find the chromedriver binary in the default ' +
            'location used by webdriver-manager');

        try {
          this.config_.chromeDriver = new ChromeDriver().getBinaryPath();
        } catch (err) {
          throw new BrowserError(logger, 'Run \'webdriver-manager update\' to download binaries.');
        }
      }

      // Check if file exists, if not try .exe or fail accordingly
      if (!fs.existsSync(this.config_.chromeDriver)) {
        if (fs.existsSync(this.config_.chromeDriver + '.exe')) {
          this.config_.chromeDriver += '.exe';
        } else {
          throw new BrowserError(
              logger,
              'Could not find chromedriver at ' + this.config_.chromeDriver +
                  '. Run \'webdriver-manager update\' to download binaries.');
        }
      }
    }

    if (this.config_.capabilities.browserName === 'firefox') {
      if (!this.config_.geckoDriver) {
        logger.debug(
            'Attempting to find the gecko driver binary in the default ' +
            'location used by webdriver-manager');

        try {
          this.config_.geckoDriver = new GeckoDriver().getBinaryPath();
        } catch (err) {
          throw new BrowserError(logger, 'Run \'webdriver-manager update\' to download binaries.');
        }
      }

      // Check if file exists, if not try .exe or fail accordingly
      if (!fs.existsSync(this.config_.geckoDriver)) {
        if (fs.existsSync(this.config_.geckoDriver + '.exe')) {
          this.config_.geckoDriver += '.exe';
        } else {
          throw new BrowserError(
              logger,
              'Could not find gecko driver at ' + this.config_.geckoDriver +
                  '. Run \'webdriver-manager update\' to download binaries.');
        }
      }
    }
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {Promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  async setupDriverEnv(): Promise<any> {
    this.addDefaultBinaryLocs_();
    logger.info('Starting selenium standalone server...');

    let serverConf = this.config_.localSeleniumStandaloneOpts || {};

    // If args or port is not set use seleniumArgs and seleniumPort
    // for backward compatibility
    if (serverConf.args === undefined) {
      serverConf.args = this.config_.seleniumArgs || [];
    }
    if (serverConf.jvmArgs === undefined) {
      serverConf.jvmArgs = this.config_.jvmArgs || [];
    } else {
      if (!Array.isArray(serverConf.jvmArgs)) {
        throw new ConfigError(logger, 'jvmArgs should be an array.');
      }
    }
    if (serverConf.port === undefined) {
      serverConf.port = this.config_.seleniumPort;
    }

    // configure server
    if (this.config_.chromeDriver) {
      serverConf.jvmArgs.push('-Dwebdriver.chrome.driver=' + this.config_.chromeDriver);
    }
    if (this.config_.geckoDriver) {
      serverConf.jvmArgs.push('-Dwebdriver.gecko.driver=' + this.config_.geckoDriver);
    }

    this.server_ = new SeleniumServer(this.config_.seleniumServerJar, serverConf);

    // start local server, grab hosted address, and resolve promise
    const url = await this.server_.start(this.config_.seleniumServerStartTimeout);

    logger.info('Selenium standalone server started at ' + url);
    const address = await this.server_.address();
    this.config_.seleniumAddress = address;
  }
}
