import * as q from 'q';
import { Config } from '../configParser';
import { DriverProvider } from './driverProvider';
export declare class Direct extends DriverProvider {
    constructor(config: Config);
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    setupEnv(): q.Promise<any>;
    /**
     * Create a new driver.
     *
     * @public
     * @override
     * @return webdriver instance
     */
    getNewDriver(): webdriver.WebDriver;
}
