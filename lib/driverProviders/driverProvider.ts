/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as q from 'q';

import {BlockingProxyRunner} from '../bpRunner';
import {Config} from '../config';

let webdriver = require('selenium-webdriver');

export abstract class DriverProvider {
  drivers_: webdriver.WebDriver[];
  config_: Config;
  private bpRunner: BlockingProxyRunner;

  constructor(config: Config) {
    this.config_ = config;
    this.drivers_ = [];
    this.bpRunner = new BlockingProxyRunner(config);
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

  getBPUrl() {
    return `http://localhost:${this.bpRunner.port}`;
  }

  /**
   * Create a new driver.
   *
   * @public
   * @return webdriver instance
   */
  getNewDriver() {
    let builder: webdriver.Builder;
    if (this.config_.useBlockingProxy) {
      builder = new webdriver.Builder()
                    .usingServer(this.getBPUrl())
                    .withCapabilities(this.config_.capabilities);
    } else {
      builder = new webdriver.Builder()
                    .usingServer(this.config_.seleniumAddress)
                    .usingWebDriverProxy(this.config_.webDriverProxy)
                    .withCapabilities(this.config_.capabilities);
    }
    if (this.config_.disableEnvironmentOverrides === true) {
      builder.disableEnvironmentOverrides();
    }
    let newDriver = builder.build();
    this.drivers_.push(newDriver);
    return newDriver;
  }

  /**
   * Quit a driver.
   *
   * @public
   * @param webdriver instance
   */
  quitDriver(driver: webdriver.WebDriver): q.Promise<webdriver.WebDriver> {
    let driverIndex = this.drivers_.indexOf(driver);
    if (driverIndex >= 0) {
      this.drivers_.splice(driverIndex, 1);
    }

    let deferred = q.defer<webdriver.WebDriver>();
    if (driver.getSession() === undefined) {
      deferred.resolve();
    } else {
      driver.getSession()
          .then((session_) => {
            if (session_) {
              driver.quit().then(function() {
                deferred.resolve();
              });
            } else {
              deferred.resolve();
            }
          })
          .catch((err: Error) => {
            deferred.resolve();
          });
    }
    return deferred.promise;
  }

  /**
   * Default update job method.
   * @return a promise
   */
  updateJob(update: any): q.Promise<any> {
    return q.fcall(function() {});
  };

  /**
   * Default setup environment method, common to all driver providers.
   */
  setupEnv(): q.Promise<any> {
    let driverPromise = this.setupDriverEnv();
    if (this.config_.useBlockingProxy) {
      // TODO(heathkit): If set, pass the webDriverProxy to BP.
      return q.all([driverPromise, this.bpRunner.start()]);
    }
    return driverPromise;
  };

  /**
   * Set up environment specific to a particular driver provider. Overridden
   * by each driver provider.
   */
  protected abstract setupDriverEnv(): q.Promise<any>;

  /**
   * Teardown and destroy the environment and do any associated cleanup.
   * Shuts down the drivers.
   *
   * @public
   * @return {q.promise} A promise which will resolve when the environment
   *     is down.
   */
  teardownEnv(): q.Promise<q.Promise<webdriver.WebDriver>[]> {
    return q.all<any>(this.drivers_.map((driver: webdriver.WebDriver) => {
      return this.quitDriver(driver);
    }));
  }
}
