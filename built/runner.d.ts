import * as q from 'q';
import { EventEmitter } from 'events';
import { Config } from './configParser';
export declare class Runner extends EventEmitter {
    config_: Config;
    preparer_: any;
    driverprovider_: any;
    o: any;
    constructor(config: Config);
    /**
     * Registrar for testPreparers - executed right before tests run.
     * @public
     * @param {string/Fn} filenameOrFn
     */
    setTestPreparer(filenameOrFn: string | Function): void;
    /**
     * Executor of testPreparer
     * @public
     * @return {q.Promise} A promise that will resolve when the test preparers
     *     are finished.
     */
    runTestPreparer(): q.Promise<any>;
    /**
     * Grab driver provider based on type
     * @private
     *
     * Priority
     * 1) if directConnect is true, use that
     * 2) if seleniumAddress is given, use that
     * 3) if a Sauce Labs account is given, use that
     * 4) if a seleniumServerJar is specified, use that
     * 5) try to find the seleniumServerJar in protractor/selenium
     */
    loadDriverProvider_(config: Config): void;
    /**
     * Responsible for cleaning up test run and exiting the process.
     * @private
     * @param {int} Standard unix exit code
     */
    exit_: (exitCode: number) => any;
    /**
     * Getter for the Runner config object
     * @public
     * @return {Object} config
     */
    getConfig(): Config;
    /**
     * Get the control flow used by this runner.
     * @return {Object} WebDriver control flow.
     */
    controlFlow(): any;
    /**
     * Sets up convenience globals for test specs
     * @private
     */
    setupGlobals_(browser_: any): void;
    /**
     * Create a new driver from a driverProvider. Then set up a
     * new protractor instance using this driver.
     * This is used to set up the initial protractor instances and any
     * future ones.
     *
     * @param {?Plugin} The plugin functions
     *
     * @return {Protractor} a protractor instance.
     * @public
     */
    createBrowser(plugins: any): any;
    /**
     * Final cleanup on exiting the runner.
     *
     * @return {q.Promise} A promise which resolves on finish.
     * @private
     */
    shutdown_(): q.Promise<any>;
    /**
     * The primary workhorse interface. Kicks off the test running process.
     *
     * @return {q.Promise} A promise which resolves to the exit code of the tests.
     * @public
     */
    run(): q.Promise<any>;
}
