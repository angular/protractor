import * as q from 'q';
import { Config } from '../configParser';
import { DriverProvider } from './driverProvider';
export declare class AttachSession extends DriverProvider {
    constructor(config: Config);
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    setupEnv(): q.Promise<any>;
    /**
     * Getting a new driver by attaching an existing session.
     *
     * @public
     * @return {WebDriver} webdriver instance
     */
    getNewDriver(): webdriver.WebDriver;
    /**
     * Maintains the existing session and does not quit the driver.
     *
     * @public
     */
    quitDriver(): q.Promise<webdriver.WebDriver>;
}
