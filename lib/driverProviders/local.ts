/*
 * This is an implementation of the Local Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 *
 * TODO - it would be nice to do this in the launcher phase,
 * so that we only start the local selenium once per entire launch.
 */
import * as fs from 'fs';
import * as path from 'path';
import * as q from 'q';

import {Config} from '../config';
import {BrowserError, ConfigError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

const SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
const SeleniumChrome = require('webdriver-manager/built/lib/binaries/chrome_driver').ChromeDriver;
const SeleniumStandAlone = require('webdriver-manager/built/lib/binaries/standalone').StandAlone;
const remote = require('selenium-webdriver/remote');

let logger = new Logger('local');

export class Local extends DriverProvider {
  server_: any;
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
        let updateJson = path.resolve(SeleniumConfig.getSeleniumDir(), 'update-config.json');
        let updateConfig = JSON.parse(fs.readFileSync(updateJson).toString());
        this.config_.seleniumServerJar = updateConfig.standalone.last;
      } catch (err) {
        throw new BrowserError(
            logger,
            'No update-config.json found.' +
                ' Run \'webdriver-manager update\' to download binaries.');
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
          let updateJson = path.resolve(SeleniumConfig.getSeleniumDir(), 'update-config.json');
          let updateConfig = JSON.parse(fs.readFileSync(updateJson).toString());
          this.config_.chromeDriver = updateConfig.chrome.last;
        } catch (err) {
          throw new BrowserError(
              logger,
              'No update-config.json found. ' +
                  'Run \'webdriver-manager update\' to download binaries.');
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
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  setupDriverEnv(): q.Promise<any> {
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

    this.server_ = new remote.SeleniumServer(this.config_.seleniumServerJar, serverConf);

    let deferred = q.defer();
    // start local server, grab hosted address, and resolve promise
    this.server_.start(this.config_.seleniumServerStartTimeout)
        .then((url: string) => {
          logger.info('Selenium standalone server started at ' + url);
          return this.server_.address();
        })
        .then((address: string) => {
          this.config_.seleniumAddress = address;
          deferred.resolve();
        })
        .catch((err: string) => {
          deferred.reject(err);
        });

    return deferred.promise;
  }

  /**
   * Teardown and destroy the environment and do any associated cleanup.
   * Shuts down the drivers and server.
   *
   * @public
   * @override
   * @return {q.promise} A promise which will resolve when the environment
   *     is down.
   */
  teardownEnv(): q.Promise<any> {
    return super.teardownEnv().then(() => {
      logger.info('Shutting down selenium standalone server.');
      return this.server_.stop();
    });
  }
}
