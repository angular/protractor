import * as q from 'q';
import { Config } from '../configParser';
import { DriverProvider } from './driverProvider';
export declare class Mock extends DriverProvider {
    constructor(config?: Config);
    /**
     * An execute function that returns a promise with a test value.
     */
    execute(): q.Promise<any>;
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve immediately.
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
