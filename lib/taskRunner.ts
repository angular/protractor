import * as child_process from 'child_process';
import {EventEmitter} from 'events';

import {Config} from './config';
import {ConfigParser} from './configParser';
import {Runner} from './runner';
import {TaskLogger} from './taskLogger';

export interface RunResults {
  taskId?: number;
  specs?: Array<string>;
  capabilities?: any;
  failedCount?: number;
  exitCode?: number;
  specResults?: Array<any>;
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
export class TaskRunner extends EventEmitter {
  constructor(
      private configFile: string, private additionalConfig: Config, private task: any,
      private runInFork: boolean) {
    super();
  }

  /**
   * Sends the run command.
   * @return {Promise} A promise that will resolve when the task finishes
   *     running. The promise contains the following parameters representing the
   *     result of the run:
   *       taskId, specs, capabilities, failedCount, exitCode, specResults
   */
  public async run(): Promise<any> {
    let runResults: RunResults = {
      taskId: this.task.taskId,
      specs: this.task.specs,
      capabilities: this.task.capabilities,
      // The following are populated while running the test:
      failedCount: 0,
      exitCode: -1,
      specResults: []
    };

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

    if (this.runInFork) {
      return new Promise((resolve, reject) => {
        let childProcess = child_process.fork(
            __dirname + '/runnerCli.js', process.argv.slice(2), {cwd: process.cwd(), silent: true});
        let taskLogger = new TaskLogger(this.task, childProcess.pid);

        // stdout pipe
        childProcess.stdout.on('data', (data: string) => {
          taskLogger.log(data);
        });

        // stderr pipe
        childProcess.stderr.on('data', (data: string) => {
          taskLogger.log(data);
        });

        childProcess
            .on('message',
                (m: any) => {
                  if (config.verboseMultiSessions) {
                    taskLogger.peek();
                  }
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
            .on('error',
                (err: any) => {
                  taskLogger.flush();
                  reject(err);
                })
            .on('exit', (code: number) => {
              taskLogger.flush();
              runResults.exitCode = code;
              resolve(runResults);
            });

        childProcess.send({
          command: 'run',
          configFile: this.configFile,
          additionalConfig: this.additionalConfig,
          capabilities: this.task.capabilities,
          specs: this.task.specs
        });
      });
    } else {
      let runner = new Runner(config);

      runner.on('testsDone', (results: RunResults) => {
        runResults.failedCount = results.failedCount;
        runResults.specResults = results.specResults;
      });

      const exitCode = await runner.run();
      runResults.exitCode = exitCode;
      return runResults;
    }
  }
}
