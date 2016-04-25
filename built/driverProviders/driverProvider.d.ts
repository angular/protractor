/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as q from 'q';
import { Config } from '../configParser';
export declare class DriverProvider {
    drivers_: webdriver.WebDriver[];
    config_: Config;
    constructor(config: Config);
    /**
     * Get all existing drivers.
     *
     * @public
     * @return array of webdriver instances
     */
    getExistingDrivers(): webdriver.WebDriver[];
    /**
     * Create a new driver.
     *
     * @public
     * @return webdriver instance
     */
    getNewDriver(): any;
    /**
     * Quit a driver.
     *
     * @public
     * @param webdriver instance
     */
    quitDriver(driver: webdriver.WebDriver): q.Promise<webdriver.WebDriver>;
    /**
     * Teardown and destroy the environment and do any associated cleanup.
     * Shuts down the drivers.
     *
     * @public
     * @return {q.promise} A promise which will resolve when the environment
     *     is down.
     */
    teardownEnv(): q.Promise<q.Promise<webdriver.WebDriver>[]>;
}
