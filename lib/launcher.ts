/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
import * as fs from 'fs';

import {Config} from './config';
import {ConfigParser} from './configParser';
import {ConfigError, ErrorHandler, ProtractorError} from './exitCodes';
import {Logger} from './logger';
import {TaskRunner} from './taskRunner';
import {TaskScheduler} from './taskScheduler';
import {runFilenameOrFn_} from './util';


let logger = new Logger('launcher');
let RUNNERS_FAILED_EXIT_CODE = 100;

/**
 * Keeps track of a list of task results. Provides method to add a new
 * result, aggregate the results into a summary, count failures,
 * and save results into a JSON file.
 */
class TaskResults {
  // TODO: set a type for result
  results_: any[] = [];

  add(result: any): void {
    this.results_.push(result);
  }

  totalSpecFailures(): number {
    return this.results_.reduce((specFailures, result) => {
      return specFailures + result.failedCount;
    }, 0);
  }

  totalProcessFailures(): number {
    return this.results_.reduce((processFailures, result) => {
      return !result.failedCount && result.exitCode !== 0 ? processFailures + 1 : processFailures;
    }, 0);
  }

  saveResults(filepath: string): void {
    let jsonOutput = this.results_.reduce((jsonOutput, result) => {
      return jsonOutput.concat(result.specResults);
    }, []);

    let json = JSON.stringify(jsonOutput, null, '  ');
    fs.writeFileSync(filepath, json);
  }

  reportSummary(): void {
    let specFailures = this.totalSpecFailures();
    let processFailures = this.totalProcessFailures();
    this.results_.forEach((result: any) => {
      let capabilities = result.capabilities;
      let shortName = (capabilities.logName) ?
          capabilities.logName :
          (capabilities.browserName) ? capabilities.browserName : '';
      shortName += (capabilities.version) ? capabilities.version : '';
      shortName += (capabilities.logName && capabilities.count < 2) ? '' : ' #' + result.taskId;
      if (result.failedCount) {
        logger.info(shortName + ' failed ' + result.failedCount + ' test(s)');
      } else if (result.exitCode !== 0) {
        logger.info(shortName + ' failed with exit code: ' + result.exitCode);
      } else {
        logger.info(shortName + ' passed');
      }
    });

    if (specFailures && processFailures) {
      logger.info(
          'overall: ' + specFailures + ' failed spec(s) and ' + processFailures +
          ' process(es) failed to complete');
    } else if (specFailures) {
      logger.info('overall: ' + specFailures + ' failed spec(s)');
    } else if (processFailures) {
      logger.info('overall: ' + processFailures + ' process(es) failed to complete');
    }
  }
}

let taskResults_ = new TaskResults();

/**
 * Initialize and run the tests.
 * Exits with 1 on test failure, and RUNNERS_FAILED_EXIT_CODE on unexpected
 * failures.
 *
 * @param {string=} configFile
 * @param {Object=} additionalConfig
 */
let initFn = async function(configFile: string, additionalConfig: Config) {
  let configParser = new ConfigParser();
  if (configFile) {
    configParser.addFileConfig(configFile);
  }
  if (additionalConfig) {
    configParser.addConfig(additionalConfig);
  }
  let config = configParser.getConfig();
  Logger.set(config);
  logger.debug('Running with --troubleshoot');
  logger.debug('Protractor version: ' + require('../package.json').version);
  logger.debug('Your base url for tests is ' + config.baseUrl);

  // Run beforeLaunch
  await runFilenameOrFn_(config.configDir, config.beforeLaunch);
  // 1) If getMultiCapabilities is set, resolve that as
  // `multiCapabilities`.
  if (config.getMultiCapabilities && typeof config.getMultiCapabilities === 'function') {
    if (config.multiCapabilities.length || config.capabilities) {
      logger.warn(
          'getMultiCapabilities() will override both capabilities ' +
          'and multiCapabilities');
    }
    // If getMultiCapabilities is defined and a function, use this.
    const waitMultiConfig = await config.getMultiCapabilities();
    config.multiCapabilities = waitMultiConfig;
    config.capabilities = null;
  }

  // 2) Set `multicapabilities` using `capabilities`,
  // `multicapabilities`, or default
  if (config.capabilities) {
    if (config.multiCapabilities.length) {
      logger.warn(
          'You have specified both capabilities and ' +
          'multiCapabilities. This will result in capabilities being ' +
          'ignored');
    } else {
      // Use capabilities if multiCapabilities is empty.
      config.multiCapabilities = [config.capabilities];
    }
  } else if (!config.multiCapabilities.length) {
    // Default to chrome if no capabilities given
    config.multiCapabilities = [{browserName: 'chrome'}];
  }

  // 3) If we're in `elementExplorer` mode, throw an error and exit.
  if (config.elementExplorer || config.framework === 'explorer') {
    const err = new Error(
        'Deprecated: Element explorer depends on the ' +
        'WebDriver control flow, and thus is no longer supported.');
    logger.error(err);
    process.exit(1);
  }

  // 4) Run tests.
  let scheduler = new TaskScheduler(config);

  process.on('uncaughtException', (exc: (Error|string)) => {
    let e = (exc instanceof Error) ? exc : new Error(exc);
    if (config.ignoreUncaughtExceptions) {
      // This can be a sign of a bug in the test framework, that it may
      // not be handling WebDriver errors properly. However, we don't
      // want these errors to prevent running the tests.
      logger.warn('Ignoring uncaught error ' + exc);
      return;
    }
    logger.error(e.message);
    logger.error(e.stack);
    if (e instanceof ProtractorError) {
      let protractorError = e as ProtractorError;
      process.exit(protractorError.code);
    } else {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (reason: Error | any, p: Promise<any>) => {
    if (reason.stack.match('angular testability are undefined') ||
        reason.stack.match('angular is not defined')) {
      logger.warn(
          'Unhandled promise rejection error: This is usually occurs ' +
          'when a browser.get call is made and a previous async call was ' +
          'not awaited');
    }
    logger.warn(p);
  });

  process.on('exit', (code: number) => {
    if (code) {
      logger.error('Process exited with error code ' + code);
    } else if (scheduler.numTasksOutstanding() > 0) {
      logger.error(
          'BUG: launcher exited with ' + scheduler.numTasksOutstanding() + ' tasks remaining');
      process.exit(RUNNERS_FAILED_EXIT_CODE);
    }
  });

  // Run afterlaunch and exit
  const cleanUpAndExit = async (exitCode: number) => {
    try {
      const returned = await runFilenameOrFn_(config.configDir, config.afterLaunch, [exitCode]);
      if (typeof returned === 'number') {
        process.exit(returned);
      } else {
        process.exit(exitCode);
      }
    } catch (err) {
      logger.error('Error:', err);
      process.exit(1);
    }
  };

  const totalTasks = scheduler.numTasksOutstanding();
  let forkProcess = false;
  if (totalTasks > 1) {  // Start new processes only if there are >1 tasks.
    forkProcess = true;
    if (config.debug) {
      throw new ConfigError(
          logger, 'Cannot run in debug mode with multiCapabilities, count > 1, or sharding');
    }
  }

  const createNextTaskRunner = async () => {
    return new Promise(async (resolve) => {
      const task = scheduler.nextTask();
      if (task) {
        const taskRunner = new TaskRunner(configFile, additionalConfig, task, forkProcess);
        try {
          const result = await taskRunner.run();
          if (result.exitCode && !result.failedCount) {
            logger.error('Runner process exited unexpectedly with error code: ' + result.exitCode);
          }
          taskResults_.add(result);
          task.done();
          await createNextTaskRunner();
          // If all tasks are finished
          if (scheduler.numTasksOutstanding() === 0) {
            resolve();
          }
          logger.info(scheduler.countActiveTasks() + ' instance(s) of WebDriver still running');
        } catch (err) {
          const errorCode = ErrorHandler.parseError(err);
          logger.error('Error:', (err as any).stack || err.message || err);
          await cleanUpAndExit(errorCode ? errorCode : RUNNERS_FAILED_EXIT_CODE);
        }
      } else {
        resolve();
      }
    });
  };

  const maxConcurrentTasks = scheduler.maxConcurrentTasks();
  for (let i = 0; i < maxConcurrentTasks; ++i) {
    await createNextTaskRunner();
  }
  logger.info('Running ' + scheduler.countActiveTasks() + ' instances of WebDriver');

  // By now all runners have completed.
  // Save results if desired
  if (config.resultJsonOutputFile) {
    taskResults_.saveResults(config.resultJsonOutputFile);
  }

  taskResults_.reportSummary();
  let exitCode = 0;
  if (taskResults_.totalProcessFailures() > 0) {
    exitCode = RUNNERS_FAILED_EXIT_CODE;
  } else if (taskResults_.totalSpecFailures() > 0) {
    exitCode = 1;
  }
  await cleanUpAndExit(exitCode);
  // Start `const maxConcurrentTasks` workers for handling tasks in
  // the beginning. As a worker finishes a task, it will pick up the next
  // task from the scheduler's queue until all tasks are gone.

};

export let init = initFn;
