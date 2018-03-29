/*
 *  This is an implementation of the Use Existing WebDriver Driver Provider.
 *  It is responsible for setting up the account object, tearing it down, and
 *  setting up the driver correctly.
 */
import * as q from 'q';
import {promise as wdpromise, WebDriver} from 'selenium-webdriver';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

const http = require('selenium-webdriver/http');

let logger = new Logger('useExistingWebDriver');

export class UseExistingWebDriver extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected setupDriverEnv(): q.Promise<any> {
    const defer = q.defer();
    this.config_.seleniumWebDriver.getSession().then((session) => {
      logger.info('Using session id - ' + session.getId());
      return defer.resolve();
    });
    return q(undefined);
  }

  /**
   * Getting a new driver by attaching an existing session.
   *
   * @public
   * @return {WebDriver} webdriver instance
   */
  getNewDriver(): WebDriver {
    const newDriver = this.config_.seleniumWebDriver;
    this.drivers_.push(newDriver);
    return newDriver;
  }

  /**
   * Maintains the existing session and does not quit the driver.
   *
   * @public
   */
  quitDriver(): wdpromise.Promise<void> {
    return wdpromise.when(undefined);
  }
}
