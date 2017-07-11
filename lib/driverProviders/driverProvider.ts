/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as q from 'q';
import {Builder, promise as wdpromise, Session, WebDriver} from 'selenium-webdriver';

import {BlockingProxyRunner} from '../bpRunner';
import {Config} from '../config';

export abstract class DriverProvider {
  drivers_: WebDriver[];
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
    if (this.config_.blockingProxyUrl) {
      return this.config_.blockingProxyUrl;
    }
    return `http://localhost:${this.bpRunner.port}`;
  }

  /**
   * Create a new driver.
   *
   * @public
   * @return webdriver instance
   */
  getNewDriver() {
    let builder: Builder;
    if (this.config_.useBlockingProxy) {
      builder =
          new Builder().usingServer(this.getBPUrl()).withCapabilities(this.config_.capabilities);
    } else {
      builder = new Builder()
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
  quitDriver(driver: WebDriver): wdpromise.Promise<void> {
    let driverIndex = this.drivers_.indexOf(driver);
    if (driverIndex >= 0) {
      this.drivers_.splice(driverIndex, 1);
    }

    if (driver.getSession() === undefined) {
      return wdpromise.when(undefined);
    } else {
      return driver.getSession()
          .then<void>((session_: Session) => {
            if (session_) {
              return driver.quit();
            }
          })
          .catch<void>(function(err: Error) {});
    }
  }


  /**
   * Quits an array of drivers and returns a q promise instead of a webdriver one
   *
   * @param drivers {webdriver.WebDriver[]} The webdriver instances
   */
  static quitDrivers(provider: DriverProvider, drivers: WebDriver[]): q.Promise<void> {
    let deferred = q.defer<void>();
    wdpromise
        .all(drivers.map((driver: WebDriver) => {
          return provider.quitDriver(driver);
        }))
        .then(
            () => {
              deferred.resolve();
            },
            () => {
              deferred.resolve();
            });
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
    if (this.config_.useBlockingProxy && !this.config_.blockingProxyUrl) {
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
   * @return {q.Promise<any>} A promise which will resolve when the environment is down.
   */
  teardownEnv(): q.Promise<any> {
    return DriverProvider.quitDrivers(this, this.drivers_);
  }
}
