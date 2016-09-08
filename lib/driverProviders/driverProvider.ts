/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import {Builder, WebDriver} from 'selenium-webdriver';

import {Config} from '../config';

let webdriver = require('selenium-webdriver');

export class DriverProvider {
  drivers_: webdriver.WebDriver[];
  config_: Config;

  constructor(config: Config) {
    this.config_ = config;
    this.drivers_ = [];
  }

  /**
   * Get all existing drivers.
   *
   * @public
   * @return array of webdriver instances
   */
  getExistingDrivers() {
    return this.drivers_.slice();  // Create a shallow copy
  }

  /**
   * Create a new driver.
   *
   * @public
   * @return webdriver instance
   */
  getNewDriver() {
    console.log('build!');
    let builder = new Builder()
                      .usingServer(this.config_.seleniumAddress)
                      .usingWebDriverProxy(this.config_.webDriverProxy)
                      .withCapabilities(this.config_.capabilities);
    if (this.config_.disableEnvironmentOverrides === true) {
      builder.disableEnvironmentOverrides();
    }
    let newDriver = builder.build();
    console.log('built!');
    this.drivers_.push(newDriver);
    return newDriver;
  }

  /**
   * Quit a driver.
   *
   * @public
   * @param webdriver instance
   */
  quitDriver(driver: WebDriver): Promise<WebDriver> {
    let driverIndex = this.drivers_.indexOf(driver);
    if (driverIndex >= 0) {
      this.drivers_.splice(driverIndex, 1);
    }

    return new Promise<WebDriver>((resolve, reject) => {
      if (driver.getSession() === undefined) {
        resolve();
      } else {
        driver.getSession().then((session_: string) => {
          if (session_) {
            driver.quit().then(function() { resolve(); });
          } else {
            resolve();
          }
        });
      }
    });
  }

  /**
   * Default update job method.
   * @return a promise
   */
  updateJob(update: any): Promise<any> {
    return new Promise<void>((resolve, reject) => { resolve(); });
  };

  /**
   * Default setup environment method.
   * @return a promise
   */
  setupEnv(): Promise<void> {
    return new Promise<void>((resolve, reject) => { resolve(); });
  };

  /**
   * Teardown and destroy the environment and do any associated cleanup.
   * Shuts down the drivers.
   *
   * @public
   * @return {q.promise} A promise which will resolve when the environment
   *     is down.
   */
  teardownEnv(): Promise<WebDriver[]> {
    return Promise.all(this.drivers_.map(
        (driver: WebDriver) => { return this.quitDriver(driver); }));
  }
}
