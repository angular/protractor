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
import * as util from 'util';

import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
let SeleniumChrome =
    require('webdriver-manager/built/lib/binaries/chrome_driver').ChromeDriver;
let SeleniumStandAlone =
    require('webdriver-manager/built/lib/binaries/stand_alone').StandAlone;
let remote = require('selenium-webdriver/remote');

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
      this.config_.seleniumServerJar = path.resolve(
          SeleniumConfig.getSeleniumDir(),
          new SeleniumStandAlone().executableFilename());
    }
    if (!fs.existsSync(this.config_.seleniumServerJar)) {
      throw new BrowserError(
          logger, 'No selenium server jar found at the specified ' +
              'location (' + this.config_.seleniumServerJar +
              '). Check that the version number is up to date.');
    }
    if (this.config_.capabilities.browserName === 'chrome') {
      if (!this.config_.chromeDriver) {
        logger.debug(
            'Attempting to find the chromedriver binary in the default ' +
            'location used by webdriver-manager');
        this.config_.chromeDriver = path.resolve(
            SeleniumConfig.getSeleniumDir(),
            new SeleniumChrome().executableFilename());
      }

      // Check if file exists, if not try .exe or fail accordingly
      if (!fs.existsSync(this.config_.chromeDriver)) {
        if (fs.existsSync(this.config_.chromeDriver + '.exe')) {
          this.config_.chromeDriver += '.exe';
        } else {
          throw new BrowserError(
              logger,
              'Could not find chromedriver at ' + this.config_.chromeDriver);
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
  setupEnv(): q.Promise<any> {
    let deferred = q.defer();

    this.addDefaultBinaryLocs_();

    logger.info('Starting selenium standalone server...');

    let serverConf = this.config_.localSeleniumStandaloneOpts || {};

    // If args or port is not set use seleniumArgs and seleniumPort
    // for backward compatibility
    if (serverConf.args === undefined) {
      serverConf.args = this.config_.seleniumArgs || [];
    }
    if (serverConf.port === undefined) {
      serverConf.port = this.config_.seleniumPort;
    }

    // configure server
    if (this.config_.chromeDriver) {
      serverConf.args.push(
          '-Dwebdriver.chrome.driver=' + this.config_.chromeDriver);
    }

    this.server_ =
        new remote.SeleniumServer(this.config_.seleniumServerJar, serverConf);

    // start local server, grab hosted address, and resolve promise
    this.server_.start().then((url: string) => {
      logger.info('Selenium standalone server started at ' + url);
      this.server_.address().then((address: string) => {
        this.config_.seleniumAddress = address;
        deferred.resolve();
      });
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
    let deferred = q.defer();
    super.teardownEnv().then(() => {
      logger.info('Shutting down selenium standalone server.');
      this.server_.stop().then(() => { deferred.resolve(); });
    });
    return deferred.promise;
  }
}
