/*
 * This is an implementation of the Experitest Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

import {Session, WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let logger = new Logger('experitest');

export class Experitest extends DriverProvider {
  experitestServer_: any;

  constructor(config: Config) {
    super(config);
  }

  /**
   * Hook to update the experitest test result
   * @public
   * @param {Object} update
   * @return {q.promise} A promise that will resolve when the update is complete.
   */
  updateJob(update: any): Promise<any> {
    let mappedDrivers = this.drivers_.map(async (driver: WebDriver) => {
      const session = await driver.getSession();
      if (!update.passed) {
        try {
          driver.executeScript(
              'seetest:client.setReportStatus("Failed", "Failed","No stack trace")');
        } catch (e) {
          logger.info('Error updating Experitest cloud with test status');
        }
      }
    });
    return Promise.all(mappedDrivers);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected async setupDriverEnv(): Promise<any> {
    this.config_.capabilities['accessKey'] = this.config_.experitestKey;
    this.config_.seleniumAddress = this.config_.experitestCloudAddress + '/wd/hub';

    logger.info('Using Experitest cloud server at ' + this.config_.seleniumAddress);
  }
}
