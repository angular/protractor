import { Config } from './configParser';
export interface Task {
    capabilities: any;
    specs: Array<string>;
    taskId: string;
    done: any;
}
/**
 * The taskScheduler keeps track of the spec files that needs to run next
 * and which task is running what.
 */
export declare class TaskQueue {
    capabilities: any;
    specLists: any;
    numRunningInstances: number;
    maxInstance: number;
    specsIndex: number;
    constructor(capabilities: any, specLists: any);
}
export declare class TaskScheduler {
    private config;
    taskQueues: Array<TaskQueue>;
    rotationIndex: number;
    /**
     * A scheduler to keep track of specs that need running and their associated
     * capabilities. It will suggest a task (combination of capabilities and spec)
     * to run while observing the following config rules:
     * multiCapabilities, shardTestFiles, and maxInstance.
     * Precondition: multiCapabilities is a non-empty array
     * (capabilities and getCapabilities will both be ignored)
     *
     * @constructor
     * @param {Object} config parsed from the config file
     */
    constructor(config: Config);
    /**
     * Get the next task that is allowed to run without going over maxInstance.
     *
     * @return {{capabilities: Object, specs: Array.<string>, taskId: string,
     * done: function()}}
     */
    nextTask(): Task;
    /**
     * Get the number of tasks left to run or are currently running.
     *
     * @return {number}
     */
    numTasksOutstanding(): number;
    /**
     * Get maximum number of concurrent tasks required/permitted.
     *
     * @return {number}
     */
    maxConcurrentTasks(): number;
    /**
     * Returns number of tasks currently running.
     *
     * @return {number}
     */
    countActiveTasks(): number;
}
