export declare class TaskLogger {
    private task;
    private pid;
    private buffer;
    private insertTag;
    /**
     * Log output such that metadata are appended.
     * Calling log(data) will not flush to console until you call flush()
     *
     * @constructor
     * @param {object} task Task that is being reported.
     * @param {number} pid PID of process running the task.
     */
    constructor(task: any, pid: number);
    /**
     * Log the header for the current task including information such as
     * PID, browser name/version, task Id, specs being run.
     *
     * @private
     */
    private logHeader_();
    /**
     * Flushes the buffer to stdout.
     */
    flush(): void;
    /**
     * Log the data in the argument such that metadata are appended.
     * The data will be saved to a buffer until flush() is called.
     *
     * @param {string} data
     */
    log(data: string): void;
}
