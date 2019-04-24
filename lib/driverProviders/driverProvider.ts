/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import {Builder, WebDriver} from 'selenium-webdriver';
import {BlockingProxyRunner} from '../bpRunner';
import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

let logger = new Logger('driverProvider');

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
   * @return a promise to a webdriver instance
   */
  async getNewDriver(): Promise<WebDriver> {
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
    let newDriver: WebDriver;
    try {
      newDriver = await builder.build();
    } catch (e) {
      throw new BrowserError(logger, (e as Error).message);
    }
    this.drivers_.push(newDriver);
    return newDriver;
  }

  /**
   * Quit a driver.
   *
   * @public
   * @param webdriver instance
   */
  async quitDriver(driver: WebDriver): Promise<void> {
    let driverIndex = this.drivers_.indexOf(driver);
    if (driverIndex >= 0) {
      this.drivers_.splice(driverIndex, 1);
      try {
        await driver.close();
        await driver.quit();
      } catch (err) {
        // This happens when Protractor keeps track of all the webdrivers
        // created and calls quit. If a user calls driver.quit, then this will
        // throw an error. This catch will swallow the error.
      }
    }
  }

  /**
   * Quits an array of drivers and returns a q promise instead of a webdriver one
   *
   * @param drivers {webdriver.WebDriver[]} The webdriver instances
   */
  static async quitDrivers(provider: DriverProvider, drivers: WebDriver[]): Promise<void> {
    await Promise.all(drivers.map((driver: WebDriver) => {
      return provider.quitDriver(driver);
    }));
  }

  /**
   * Default update job method.
   * @return a promise
   */
  async updateJob(update: any): Promise<any> {}

  /**
   * Default setup environment method, common to all driver providers.
   */
  async setupEnv(): Promise<any> {
    await this.setupDriverEnv();
    if (this.config_.useBlockingProxy && !this.config_.blockingProxyUrl) {
      await this.bpRunner.start();
    }
  }

  /**
   * Set up environment specific to a particular driver provider. Overridden
   * by each driver provider.
   */
  protected async abstract setupDriverEnv(): Promise<any>;

  /**
   * Teardown and destroy the environment and do any associated cleanup.
   * Shuts down the drivers.
   *
   * @public
   * @return {Promise<any>} A promise which will resolve when the environment is down.
   */
  async teardownEnv(): Promise<any> {
    await DriverProvider.quitDrivers(this, this.drivers_);
  }
}
