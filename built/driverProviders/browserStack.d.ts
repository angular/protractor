import * as q from 'q';
import { Config } from '../configParser';
import { DriverProvider } from './driverProvider';
export declare class BrowserStack extends DriverProvider {
    constructor(config: Config);
    /**
     * Hook to update the BrowserStack job status.
     * @public
     * @param {Object} update
     * @return {q.promise} A promise that will resolve when the update is complete.
     */
    updateJob(update: any): q.Promise<any>;
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    setupEnv(): q.Promise<any>;
}
