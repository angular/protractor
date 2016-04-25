import { EventEmitter } from 'events';
import * as q from 'q';
import { Config } from './configParser';
export interface RunResults {
    taskId: number;
    specs: Array<string>;
    capabilities: any;
    failedCount: number;
    exitCode: number;
    specResults: Array<any>;
}
/**
 * A runner for running a specified task (capabilities + specs).
 * The TaskRunner can either run the task from the current process (via
 * './runner.js') or from a new process (via './runnerCli.js').
 *
 * @constructor
 * @param {string} configFile Path of test configuration.
 * @param {object} additionalConfig Additional configuration.
 * @param {object} task Task to run.
 * @param {boolean} runInFork Whether to run test in a forked process.
 * @constructor
 */
export declare class TaskRunner extends EventEmitter {
    private configFile;
    private additionalConfig;
    private task;
    private runInFork;
    constructor(configFile: string, additionalConfig: Config, task: any, runInFork: boolean);
    /**
     * Sends the run command.
     * @return {q.Promise} A promise that will resolve when the task finishes
     *     running. The promise contains the following parameters representing the
     *     result of the run:
     *       taskId, specs, capabilities, failedCount, exitCode, specResults
     */
    run(): q.Promise<any>;
}
