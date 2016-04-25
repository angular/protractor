import * as q from 'q';
import { Config } from '../configParser';
import { DriverProvider } from './driverProvider';
export declare class Local extends DriverProvider {
    server_: any;
    constructor(config: Config);
    /**
     * Helper to locate the default jar path if none is provided by the user.
     * @private
     */
    addDefaultBinaryLocs_(): void;
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    setupEnv(): q.Promise<any>;
    /**
     * Teardown and destroy the environment and do any associated cleanup.
     * Shuts down the drivers and server.
     *
     * @public
     * @override
     * @return {q.promise} A promise which will resolve when the environment
     *     is down.
     */
    teardownEnv(): q.Promise<any>;
}
