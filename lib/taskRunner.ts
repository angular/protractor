import {fork} from 'child_process';
import {EventEmitter} from 'events';
import {defer, Promise} from 'q';
import {inherits} from 'util';

import ConfigParser, {Config} from './configParser';
import * as Logger from './logger';
import TaskLogger from './taskLogger';

export interface RunResults {
  taskId: number;
  specs: Array<string>;
  capabilities: any;
  failedCount: number;
  exitCode: number;
  specResults: Array<any>;
}

export default class TaskRunner extends EventEmitter {
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
  constructor(
      private configFile: string, private additionalConfig: Config,
      private task: any, private runInFork: boolean) {
    super();
  }

  /**
   * Sends the run command.
   * @return {q.Promise} A promise that will resolve when the task finishes
   *     running. The promise contains the following parameters representing the
   *     result of the run:
   *       taskId, specs, capabilities, failedCount, exitCode, specResults
   */
  public run(): Promise<any> {
    let runResults: RunResults = {
      taskId: this.task.taskId,
      specs: this.task.specs,
      capabilities: this.task.capabilities,
      // The following are populated while running the test:
      failedCount: 0,
      exitCode: -1,
      specResults: []
    };

    if (this.runInFork) {
      let deferred = defer();

      let childProcess = fork(
          __dirname + '/runnerCli.js', process.argv.slice(2),
          {cwd: process.cwd(), silent: true});
      let taskLogger = new TaskLogger(this.task, childProcess.pid);

      // stdout pipe
      childProcess.stdout.on(
          'data', (data: string) => { taskLogger.log(data); });

      // stderr pipe
      childProcess.stderr.on(
          'data', (data: string) => { taskLogger.log(data); });

      childProcess
          .on('message',
              (m: any) => {
                switch (m.event) {
                  case 'testPass':
                    Logger.print('.');
                    break;
                  case 'testFail':
                    Logger.print('F');
                    break;
                  case 'testsDone':
                    runResults.failedCount = m.results.failedCount;
                    runResults.specResults = m.results.specResults;
                    break;
                }
              })
          .on('error',
              (err: any) => {
                taskLogger.flush();
                deferred.reject(err);
              })
          .on('exit', (code: number) => {
            taskLogger.flush();
            runResults.exitCode = code;
            deferred.resolve(runResults);
          });

      childProcess.send({
        command: 'run',
        configFile: this.configFile,
        additionalConfig: this.additionalConfig,
        capabilities: this.task.capabilities,
        specs: this.task.specs
      });

      return deferred.promise;
    } else {
      let configParser = new ConfigParser();
      if (this.configFile) {
        configParser.addFileConfig(this.configFile);
      }
      if (this.additionalConfig) {
        configParser.addConfig(this.additionalConfig);
      }
      let config = configParser.getConfig();
      config.capabilities = this.task.capabilities;
      config.specs = this.task.specs;

      let Runner = require('./runner');
      let runner = new Runner(config);

      runner.on('testsDone', (results: RunResults) => {
        runResults.failedCount = results.failedCount;
        runResults.specResults = results.specResults;
      });

      return runner.run().then((exitCode: number) => {
        runResults.exitCode = exitCode;
        return runResults;
      });
    }
  }
}
