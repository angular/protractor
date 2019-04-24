/*
 * This is an implementation of the Browserstack Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import {WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

const BrowserstackClient = require('browserstack');

let logger = new Logger('browserstack');

export class BrowserStack extends DriverProvider {
  browserstackClient: any;

  constructor(config: Config) {
    super(config);
  }

  /**
   * Hook to update the BrowserStack job status.
   * @public
   * @param {Object} update
   * @return {Promise} A promise that will resolve when the update is complete.
   */
  async updateJob(update: any): Promise<any> {
    let mappedDrivers = this.drivers_.map(async (driver: WebDriver) => {
      let session = await driver.getSession();

      // Fetching BrowserStack session details.
      this.browserstackClient.getSession(
          session.getId(), function(error: Error, automate_session: any) {
            if (error) {
              logger.info(
                  'BrowserStack results available at ' +
                  'https://www.browserstack.com/automate');
            } else {
              if (automate_session && automate_session.browser_url) {
                logger.info('BrowserStack results available at ' + automate_session.browser_url);
              } else {
                logger.info(
                    'BrowserStack results available at ' +
                    'https://www.browserstack.com/automate');
              }
            }
          });

      let jobStatus = update.passed ? 'completed' : 'error';
      let statusObj = {status: jobStatus};

      // Updating status of BrowserStack session.
      this.browserstackClient.updateSession(
          session.getId(), statusObj, function(error: Error, automate_session: any) {
            if (error) {
              throw new BrowserError(
                  logger, 'Error updating BrowserStack pass/fail status: ' + util.inspect(error));
            } else {
              logger.info(automate_session);
            }
          });
    });

    return Promise.all(mappedDrivers);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected async setupDriverEnv(): Promise<any> {
    this.config_.capabilities['browserstack.user'] = this.config_.browserstackUser;
    this.config_.capabilities['browserstack.key'] = this.config_.browserstackKey;
    this.config_.seleniumAddress = 'http://hub.browserstack.com/wd/hub';

    this.browserstackClient = BrowserstackClient.createAutomateClient({
      username: this.config_.browserstackUser,
      password: this.config_.browserstackKey,
      proxy: this.config_.browserstackProxy
    });

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    if (this.config_.capabilities.name && this.config_.capabilities.shardTestFiles) {
      this.config_.capabilities.name +=
          (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
    }

    logger.info(`Using BrowserStack selenium server at ${this.config_.seleniumAddress}`);
  }
}
