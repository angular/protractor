"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var child_process = require('child_process');
var events_1 = require('events');
var q = require('q');
var configParser_1 = require('./configParser');
var runner_1 = require('./runner');
var taskLogger_1 = require('./taskLogger');
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
var TaskRunner = (function (_super) {
    __extends(TaskRunner, _super);
    function TaskRunner(configFile, additionalConfig, task, runInFork) {
        _super.call(this);
        this.configFile = configFile;
        this.additionalConfig = additionalConfig;
        this.task = task;
        this.runInFork = runInFork;
    }
    /**
     * Sends the run command.
     * @return {q.Promise} A promise that will resolve when the task finishes
     *     running. The promise contains the following parameters representing the
     *     result of the run:
     *       taskId, specs, capabilities, failedCount, exitCode, specResults
     */
    TaskRunner.prototype.run = function () {
        var runResults = {
            taskId: this.task.taskId,
            specs: this.task.specs,
            capabilities: this.task.capabilities,
            // The following are populated while running the test:
            failedCount: 0,
            exitCode: -1,
            specResults: []
        };
        if (this.runInFork) {
            var deferred_1 = q.defer();
            var childProcess = child_process.fork(__dirname + '/runnerCli.js', process.argv.slice(2), { cwd: process.cwd(), silent: true });
            var taskLogger_2 = new taskLogger_1.TaskLogger(this.task, childProcess.pid);
            // stdout pipe
            childProcess.stdout.on('data', function (data) {
                taskLogger_2.log(data);
            });
            // stderr pipe
            childProcess.stderr.on('data', function (data) {
                taskLogger_2.log(data);
            });
            childProcess
                .on('message', function (m) {
                switch (m.event) {
                    case 'testPass':
                        process.stdout.write('.');
                        break;
                    case 'testFail':
                        process.stdout.write('F');
                        break;
                    case 'testsDone':
                        runResults.failedCount = m.results.failedCount;
                        runResults.specResults = m.results.specResults;
                        break;
                }
            })
                .on('error', function (err) {
                taskLogger_2.flush();
                deferred_1.reject(err);
            })
                .on('exit', function (code) {
                taskLogger_2.flush();
                runResults.exitCode = code;
                deferred_1.resolve(runResults);
            });
            childProcess.send({
                command: 'run',
                configFile: this.configFile,
                additionalConfig: this.additionalConfig,
                capabilities: this.task.capabilities,
                specs: this.task.specs
            });
            return deferred_1.promise;
        }
        else {
            var configParser = new configParser_1.ConfigParser();
            if (this.configFile) {
                configParser.addFileConfig(this.configFile);
            }
            if (this.additionalConfig) {
                configParser.addConfig(this.additionalConfig);
            }
            var config = configParser.getConfig();
            config.capabilities = this.task.capabilities;
            config.specs = this.task.specs;
            var runner = new runner_1.Runner(config);
            runner.on('testsDone', function (results) {
                runResults.failedCount = results.failedCount;
                runResults.specResults = results.specResults;
            });
            return runner.run().then(function (exitCode) {
                runResults.exitCode = exitCode;
                return runResults;
            });
        }
    };
    return TaskRunner;
}(events_1.EventEmitter));
exports.TaskRunner = TaskRunner;
