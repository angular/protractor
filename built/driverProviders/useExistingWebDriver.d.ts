/// <reference types="q" />
import * as q from 'q';
import { promise as wdpromise, WebDriver } from 'selenium-webdriver';
import { Config } from '../config';
import { DriverProvider } from './driverProvider';
export declare class UseExistingWebDriver extends DriverProvider {
    constructor(config: Config);
    /**
     * Configure and launch (if applicable) the object's environment.
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    protected setupDriverEnv(): q.Promise<any>;
    /**
     * Getting a new driver by attaching an existing session.
     *
     * @public
     * @return {WebDriver} webdriver instance
     */
    getNewDriver(): WebDriver;
    /**
     * Maintains the existing session and does not quit the driver.
     *
     * @public
     */
    quitDriver(): wdpromise.Promise<void>;
}
