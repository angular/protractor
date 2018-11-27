#!/usr/bin/env node

const child_process = require('child_process');

class CommandlineTest {
  constructor(command) {
    this.command = command;
    this.expectedExitCode = 0;
    this.expectedErrors = [];
    this.isExitCode = false;
    this.testLogStream = undefined;
    this.expectedMinTestDuration = undefined;
    this.expectedMaxTestDuration = undefined;
  }


  // Only assert the exit code and not failures.
  // This must be true if the command you're running does not support
  //   the flag '--resultJsonOutputFile'.
  assertExitCodeOnly() {
    this.isExitCode = true;
    return this;
  }

  setTestLogFile(filename) {
    this.testLogStream = fs.createWriteStream(filename, {flags: 'a'});
  }

  // Set the expected exit code for the test command.
  expectExitCode(exitCode) {
    this.expectedExitCode = exitCode;
    return this;
  }

  // Set the expected total test duration in milliseconds.
  expectTestDuration(min, max) {
    this.expectedMinTestDuration = min;
    this.expectedMaxTestDuration = max;
    return this;
  }

  /**
   * Add expected error(s) for the test command.
   * Input is an object or list of objects of the following form:
   * {
   *   message: string, // optional regex
   *   stackTrace: string, //optional regex
   * }
   */
  expectErrors(expectedErrors) {
    if (expectedErrors instanceof Array) {
      this.expectedErrors = this.expectedErrors.concat(expectedErrors);
    } else {
      this.expectedErrors.push(expectedErrors);
    }
    return this;
  }

  async run() {
    const start = new Date().getTime();
    const testOutputPath = `test_output_${start}.tmp`;
    let output = '';

    const flushAndFail = (errorMsg) => {
      process.stdout.write(output);
      throw new Error(errorMsg);
    };

    if (!this.isExitCode) {
      this.command = this.command + ' --resultJsonOutputFile ' + testOutputPath;
    }
    const args = this.command.split(/\s/);
    let test_process;

    test_process = child_process.spawn(args[0], args.slice(1));

    const processData = (data) => {
      process.stdout.write('.');
      output += data;
      if (this.testLogStream) {
        this.testLogStream.write(data);
      }
    };

    test_process.stdout.on('data', processData);
    test_process.stderr.on('data', processData);

    const runningTestProcess = () => {
      return new Promise((resolve, reject) => {
        test_process.on('error', (error) => {
          reject(error);
        });
        test_process.on('exit', (exitCode) => {
          resolve(exitCode);
        });
      });
    };
    const exitCode = await runningTestProcess();

    if (this.expectedExitCode !== exitCode) {
      flushAndFail('expecting exit code: ' + this.expectedExitCode +
        ', actual: ' + exitCode);
    }

    if (this.testLogStream) {
      this.testLogStream.end();
    }

    // Skip the rest if we are only verify exit code.
    // Note: we're expecting a file populated by '--resultJsonOutputFile' after
    //   this point.
    if (!this.isExitCode) {
      const raw_data = fs.readFileSync(testOutputPath);
      const testOutput = JSON.parse(raw_data);

      let actualErrors = [];
      let duration = 0;
      testOutput.forEach((specResult) => {
        duration += specResult.duration;
        specResult.assertions.forEach((assertion) => {
          if (!assertion.passed) {
            actualErrors.push(assertion);
          }
        });
      });

      this.expectedErrors.forEach((expectedError) => {
        let found = false;
        let i;
        for (i = 0; i < actualErrors.length; ++i) {
          const actualError = actualErrors[i];

          // if expected message is defined and messages don't match
          if (expectedError.message) {
            if (!actualError.errorMsg ||
              !actualError.errorMsg.match(new RegExp(expectedError.message))) {
              continue;
            }
          }
          // if expected stackTrace is defined and stackTraces don't match
          if (expectedError.stackTrace) {
            if (!actualError.stackTrace ||
              !actualError.stackTrace.match(new RegExp(expectedError.stackTrace))) {
              continue;
            }
          }
          found = true;
          break;
        }

        if (!found) {
          if (expectedError.message && expectedError.stackTrace) {
            flushAndFail('did not fail with expected error with message: [' +
              expectedError.message + '] and stackTrace: [' +
              expectedError.stackTrace + ']');
          } else if (expectedError.message) {
            flushAndFail('did not fail with expected error with message: [' +
              expectedError.message + ']');
          } else if (expectedError.stackTrace) {
            flushAndFail('did not fail with expected error with stackTrace: [' +
              expectedError.stackTrace + ']');
          }
        } else {
          actualErrors.splice(i, 1);
        }
      });

      if (actualErrors.length > 0) {
        flushAndFail('failed with ' + actualErrors.length + ' unexpected failures');
      }

      if (this.expectedMinTestDuration && duration < this.expectedMinTestDuration) {
        flushAndFail('expecting test min duration: ' + this.expectedMinTestDuration + ', actual: ' + duration);
      }
      if (this.expectedMaxTestDuration && duration > this.expectedMaxTestDuration) {
        flushAndFail('expecting test max duration: ' + this.expectedMaxTestDuration + ', actual: ' + duration);
      }
    }

    try {
      fs.unlinkSync(testOutputPath);
    } catch (err) {
      // don't do anything
    }
  }
}

/**
 * Util for running tests and testing functionalities including:
 *   exitCode, test durations, expected errors, and expected stackTrace
 * Note, this will work with any commandline tests, but only if it supports
 *   the flag '--resultJsonOutputFile', unless only exitCode is being tested.
 *   For now, this means protractor tests (jasmine/mocha).
 */
module.exports = class Executor {
  constructor() {
    this.tests = [];
  }

  addCommandlineTest(command) {
    const test = new CommandlineTest(command);
    this.tests.push(test);
    return test;
  }

  async execute(logFile) {
    let failed = false;

    for (let test of this.tests) {
      try {
        console.log('running: ' + test.command);
        if (logFile) {
          test.setTestLogFile(logFile);
        }
        await test.run();
        console.log('\n>>> \033[1;32mpass\033[0m');
      } catch (error) {
        failed = true;
        console.log('\n>>> \033[1;31mfail: ' + error.toString() + '\033[0m');
      }
    }

    console.log('Summary: ' + (failed ? 'fail' : 'pass'));
    process.exit(failed ? 1 : 0);
  }
};
