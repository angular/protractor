/*
 * This is an implementation of the LambdaTest Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import {WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

Logger.setWrite(2, 'lambda_protractor.log');
const lambdaRestClient = require('@lambdatest/node-rest-client');
let logger = new Logger('lambdatest');

export class LambdaTest extends DriverProvider {
  lambdaAutomationClient: any;

  constructor(config: Config) {
    super(config);
  }

  /**
   * Hook to update the LambdaTest job status.
   * @public
   * @param {Object} update
   * @return {Promise} A promise that will resolve when the update is complete.
   */
  updateJob(update: any): Promise<any> {
    let mappedDrivers = this.drivers_.map(async (driver: WebDriver) => {
      const session = await driver.getSession();
      const statusObj = {status_ind: update.passed ? 'passed' : 'failed'};
      this.lambdaAutomationClient.updateSessionById(session.getId(), statusObj, (error: Error) => {
        if (error) {
          throw new Error(
              'Error while updating LambdaTest passed/failed status: ' + util.inspect(error));
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
    this.config_.capabilities['user'] = this.config_.lambdaUsername;
    this.config_.capabilities['accessKey'] = this.config_.lambdaAccessKey;
    this.config_.seleniumAddress = 'https://hub.lambdatest.com/wd/hub';
    this.lambdaAutomationClient = lambdaRestClient.AutomationClient(
        {username: this.config_.lambdaUsername, accessKey: this.config_.lambdaAccessKey});

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    this.config_.capabilities.name = this.config_.capabilities.name || '';
    this.config_.capabilities.name += ':' + this.config_.specs.toString().replace(/^.*[\\\/]/, '');

    logger.info(`Using LambdaTest selenium server at ${this.config_.seleniumAddress}`);
  }
}
