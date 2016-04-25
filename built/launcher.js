"use strict";
/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
var q = require('q');
var configParser_1 = require('./configParser');
var logger2_1 = require('./logger2');
var runner_1 = require('./runner');
var taskRunner_1 = require('./taskRunner');
var taskScheduler_1 = require('./taskScheduler');
var helper = require('./util');
var logger = new logger2_1.Logger('launcher');
var RUNNERS_FAILED_EXIT_CODE = 100;
/**
 * Keeps track of a list of task results. Provides method to add a new
 * result, aggregate the results into a summary, count failures,
 * and save results into a JSON file.
 */
var TaskResults = (function () {
    function TaskResults() {
        // TODO: set a type for result
        this.results_ = [];
    }
    TaskResults.prototype.add = function (result) { this.results_.push(result); };
    TaskResults.prototype.totalSpecFailures = function () {
        return this.results_.reduce(function (specFailures, result) {
            return specFailures + result.failedCount;
        }, 0);
    };
    TaskResults.prototype.totalProcessFailures = function () {
        return this.results_.reduce(function (processFailures, result) {
            return !result.failedCount && result.exitCode !== 0 ?
                processFailures + 1 :
                processFailures;
        }, 0);
    };
    TaskResults.prototype.saveResults = function (filepath) {
        var jsonOutput = this.results_.reduce(function (jsonOutput, result) {
            return jsonOutput.concat(result.specResults);
        }, []);
        var json = JSON.stringify(jsonOutput, null, '  ');
        var fs = require('fs');
        fs.writeFileSync(filepath, json);
    };
    TaskResults.prototype.reportSummary = function () {
        var specFailures = this.totalSpecFailures();
        var processFailures = this.totalProcessFailures();
        this.results_.forEach(function (result) {
            var capabilities = result.capabilities;
            var shortName = (capabilities.browserName) ? capabilities.browserName : '';
            shortName = (capabilities.logName) ?
                capabilities.logName :
                (capabilities.browserName) ? capabilities.browserName : '';
            shortName += (capabilities.version) ? capabilities.version : '';
            shortName += (capabilities.logName && capabilities.count < 2) ?
                '' :
                ' #' + result.taskId;
            if (result.failedCount) {
                logger.info(shortName + ' failed ' + result.failedCount + ' test(s)');
            }
            else if (result.exitCode !== 0) {
                logger.info(shortName + ' failed with exit code: ' + result.exitCode);
            }
            else {
                logger.info(shortName + ' passed');
            }
        });
        if (specFailures && processFailures) {
            logger.info('overall: ' + specFailures + ' failed spec(s) and ' +
                processFailures + ' process(es) failed to complete');
        }
        else if (specFailures) {
            logger.info('overall: ' + specFailures + ' failed spec(s)');
        }
        else if (processFailures) {
            logger.info('overall: ' + processFailures + ' process(es) failed to complete');
        }
    };
    return TaskResults;
}());
var taskResults_ = new TaskResults();
/**
 * Initialize and run the tests.
 * Exits with 1 on test failure, and RUNNERS_FAILED_EXIT_CODE on unexpected
 * failures.
 *
 * @param {string=} configFile
 * @param {Object=} additionalConfig
 */
var initFn = function (configFile, additionalConfig) {
    var configParser = new configParser_1.ConfigParser();
    if (configFile) {
        configParser.addFileConfig(configFile);
    }
    if (additionalConfig) {
        configParser.addConfig(additionalConfig);
    }
    var config = configParser.getConfig();
    logger.debug('Running with --troubleshoot');
    logger.debug('Protractor version: ' + require('../package.json').version);
    logger.debug('Your base url for tests is ' + config.baseUrl);
    // Run beforeLaunch
    helper.runFilenameOrFn_(config.configDir, config.beforeLaunch)
        .then(function () {
        return q
            .Promise(function (resolve) {
            // 1) If getMultiCapabilities is set, resolve that as
            // `multiCapabilities`.
            if (config.getMultiCapabilities &&
                typeof config.getMultiCapabilities === 'function') {
                if (config.multiCapabilities.length || config.capabilities) {
                    logger.warn('getMultiCapabilities() will override both capabilities ' +
                        'and multiCapabilities');
                }
                // If getMultiCapabilities is defined and a function, use this.
                q.when(config.getMultiCapabilities(), function (multiCapabilities) {
                    config.multiCapabilities = multiCapabilities;
                    config.capabilities = null;
                }).then(function (resolve) { });
            }
            else {
                resolve();
            }
        })
            .then(function () {
            // 2) Set `multicapabilities` using `capabilities`,
            // `multicapabilities`,
            // or default
            if (config.capabilities) {
                if (config.multiCapabilities.length) {
                    logger.warn('You have specified both capabilities and ' +
                        'multiCapabilities. This will result in capabilities being ' +
                        'ignored');
                }
                else {
                    // Use capabilities if multiCapabilities is empty.
                    config.multiCapabilities = [config.capabilities];
                }
            }
            else if (!config.multiCapabilities.length) {
                // Default to chrome if no capabilities given
                config.multiCapabilities = [{ browserName: 'chrome' }];
            }
        });
    })
        .then(function () {
        // 3) If we're in `elementExplorer` mode, run only that.
        if (config.elementExplorer || config.framework === 'explorer') {
            if (config.multiCapabilities.length != 1) {
                throw new Error('Must specify only 1 browser while using elementExplorer');
            }
            else {
                config.capabilities = config.multiCapabilities[0];
            }
            config.framework = 'explorer';
            var runner = new runner_1.Runner(config);
            return runner.run().then(function (exitCode) { process.exit(exitCode); }, function (err) {
                logger.error(err);
                process.exit(1);
            });
        }
    })
        .then(function () {
        // 4) Run tests.
        var scheduler = new taskScheduler_1.TaskScheduler(config);
        process.on('exit', function (code) {
            if (code) {
                logger.error('Process exited with error code ' + code);
            }
            else if (scheduler.numTasksOutstanding() > 0) {
                logger.error('BUG: launcher exited with ' + scheduler.numTasksOutstanding() +
                    ' tasks remaining');
                process.exit(RUNNERS_FAILED_EXIT_CODE);
            }
        });
        // Run afterlaunch and exit
        var cleanUpAndExit = function (exitCode) {
            return helper
                .runFilenameOrFn_(config.configDir, config.afterLaunch, [exitCode])
                .then(function (returned) {
                if (typeof returned === 'number') {
                    process.exit(returned);
                }
                else {
                    process.exit(exitCode);
                }
            }, function (err) {
                logger.error('Error:', err);
                process.exit(1);
            });
        };
        var totalTasks = scheduler.numTasksOutstanding();
        var forkProcess = false;
        if (totalTasks >
            1) {
            forkProcess = true;
            if (config.debug) {
                throw new Error('Cannot run in debug mode with ' +
                    'multiCapabilities, count > 1, or sharding');
            }
        }
        var deferred = q.defer(); // Resolved when all tasks are completed
        var createNextTaskRunner = function () {
            var task = scheduler.nextTask();
            if (task) {
                var taskRunner = new taskRunner_1.TaskRunner(configFile, additionalConfig, task, forkProcess);
                taskRunner.run()
                    .then(function (result) {
                    if (result.exitCode && !result.failedCount) {
                        logger.error('Runner process exited unexpectedly with error code: ' +
                            result.exitCode);
                    }
                    taskResults_.add(result);
                    task.done();
                    createNextTaskRunner();
                    // If all tasks are finished
                    if (scheduler.numTasksOutstanding() === 0) {
                        deferred.resolve();
                    }
                    logger.info(scheduler.countActiveTasks() +
                        ' instance(s) of WebDriver still running');
                })
                    .catch(function (err) {
                    logger.error('Error:', err.stack || err.message || err);
                    cleanUpAndExit(RUNNERS_FAILED_EXIT_CODE);
                });
            }
        };
        // Start `scheduler.maxConcurrentTasks()` workers for handling tasks in
        // the beginning. As a worker finishes a task, it will pick up the next
        // task
        // from the scheduler's queue until all tasks are gone.
        for (var i = 0; i < scheduler.maxConcurrentTasks(); ++i) {
            createNextTaskRunner();
        }
        logger.info('Running ' + scheduler.countActiveTasks() +
            ' instances of WebDriver');
        // By now all runners have completed.
        deferred.promise
            .then(function () {
            // Save results if desired
            if (config.resultJsonOutputFile) {
                taskResults_.saveResults(config.resultJsonOutputFile);
            }
            taskResults_.reportSummary();
            var exitCode = 0;
            if (taskResults_.totalProcessFailures() > 0) {
                exitCode = RUNNERS_FAILED_EXIT_CODE;
            }
            else if (taskResults_.totalSpecFailures() > 0) {
                exitCode = 1;
            }
            return cleanUpAndExit(exitCode);
        })
            .done();
    })
        .done();
};
exports.init = initFn;
