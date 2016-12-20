import * as os from 'os';
import {Logger} from './logger';

let logger = new Logger('testLogger');

export class TaskLogger {
  private buffer: string = '';
  private insertTag: boolean = true;

  /**
   * Log output such that metadata are appended.
   * Calling log(data) will not flush to console until you call flush()
   *
   * @constructor
   * @param {object} task Task that is being reported.
   * @param {number} pid PID of process running the task.
   */
  constructor(private task: any, private pid: number) {
    this.logHeader_();
  }

  /**
   * Log the header for the current task including information such as
   * PID, browser name/version, task Id, specs being run.
   *
   * @private
   */
  private logHeader_(): void {
    let output = 'PID: ' + this.pid + os.EOL;
    if (this.task.specs.length === 1) {
      output += 'Specs: ' + this.task.specs.toString() + os.EOL + os.EOL;
    }
    this.log(output);
  }

  /**
   * Prints the contents of the buffer without clearing it.
   */
  public peek(): void {
    if (this.buffer) {
      // Flush buffer if nonempty
      logger.info(os.EOL + '------------------------------------' + os.EOL);
      logger.info(this.buffer);
      logger.info(os.EOL);
    }
  }

  /**
   * Flushes the buffer to stdout.
   */
  public flush(): void {
    if (this.buffer) {
      this.peek();
      this.buffer = '';
    }
  }

  /**
   * Log the data in the argument such that metadata are appended.
   * The data will be saved to a buffer until flush() is called.
   *
   * @param {string} data
   */
  public log(data: string): void {
    let tag = '[';
    let capabilities = this.task.capabilities;
    tag += (capabilities.logName) ? capabilities.logName :
                                    (capabilities.browserName) ? capabilities.browserName : '';
    tag += (capabilities.version) ? (' ' + capabilities.version) : '';
    tag += (capabilities.platform) ? (' ' + capabilities.platform) : '';
    tag += (capabilities.logName && capabilities.count < 2) ? '' : ' #' + this.task.taskId;
    tag += '] ';

    data = data.toString();
    for (let i = 0; i < data.length; i++) {
      if (this.insertTag) {
        this.insertTag = false;
        // This ensures that the '\x1B[0m' appears before the tag, so that
        // data remains correct when color is not processed.
        // See https://github.com/angular/protractor/pull/1216
        if (data[i] === '\x1B' && data.substring(i, i + 4) === '\x1B[0m') {
          this.buffer += ('\x1B[0m' + tag);
          i += 3;
          continue;
        }

        this.buffer += tag;
      }
      if (data[i] === '\n') {
        this.insertTag = true;
      }
      this.buffer += data[i];
    }
  }
}
