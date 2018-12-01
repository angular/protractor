import {Runner} from '../runner';

export interface JasmineSpecResult {
  description: string;
  fullName: string;
  status: Status;
  failedExpectations: Array<FailedExpectation>;
}

export interface FailedExpectation {
  passed: boolean;
  message: string;
  stack: string;
}

export interface SpecInfo {
  name: string;
  category: string;
}

export interface Entry {
  description: string;
  assertions: Array<Assertion>;
  duration: number;
}

export interface Assertion {
  passed: boolean;
  errorMsg?: string;
  stackTrace?: string;
}

export const enum Status {
  PASSED = 'passed',
    FAILED = 'failed'
}

export class RunnerReporter {
  public testResult: Array<Entry>;
  public failedCount: number;
  private startTime: Date;
  private emitter: Runner;

  constructor(emitter: Runner) {
    this.emitter = emitter;
    this.testResult = [];
    this.failedCount = 0;
  }

  public jasmineStarted(): void {
    // Need to initiate startTime here, in case reportSpecStarting is not
    // called (e.g. when fit is used)
    this.startTime = new Date();
  }

  public specStarted() {
    this.startTime = new Date();
  }

  public specDone(result: JasmineSpecResult) {
    const specInfo: SpecInfo = {
      name: result.description,
      category: result.fullName.slice(0, -result.description.length).trim()
    };

    switch(result.status) {
      case Status.PASSED: {
        this.emitter.emit('testPass', specInfo);
        break;
      }
      case Status.FAILED: {
        this.emitter.emit('testFail', specInfo);
        this.failedCount++;
        break;
      }
    }

    let entry: Entry = {
      description: result.fullName,
      assertions: [],
      duration: new Date().getTime() - this.startTime.getTime()
    };

    if (result.failedExpectations.length === 0) {
      entry.assertions.push({
        passed: true
      });
    }

    result.failedExpectations.forEach((item: FailedExpectation) => {
      entry.assertions.push({
        passed: item.passed,
        errorMsg: item.passed ? undefined : item.message,
        stackTrace: item.passed ? undefined : item.stack
      });
    });

    this.testResult.push(entry);
  }
}

/**
 * Execute the Runner's test cases through Jasmine.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 */
export const run = async (runner: Runner, specs: Array<string>) => {
  const JasmineRunner = require('jasmine');
  const jrunner = new JasmineRunner();
  const jasmineNodeOpts = runner.getConfig().jasmineNodeOpts;

  // On timeout, the flow should be reset. This will prevent webdriver tasks
  // from overflowing into the next test and causing it to fail or timeout
  // as well. This is done in the reporter instead of an afterEach block
  // to ensure that it runs after any afterEach() blocks with webdriver tasks
  // get to complete first.
  const reporter: any = new RunnerReporter(runner);
  jasmine.getEnv().addReporter(reporter);

  // Add hooks for afterEach
  require('./setupAfterEach').setup(runner, specs);

  // Filter specs to run based on jasmineNodeOpts.grep and jasmineNodeOpts.invert.
  jasmine.getEnv().specFilter = (spec) => {
    const grepMatch = !jasmineNodeOpts ||
      !jasmineNodeOpts.grep ||
      spec.getFullName().match(new RegExp(jasmineNodeOpts.grep)) != null;
    const invertGrep = !!(jasmineNodeOpts && jasmineNodeOpts.invertGrep);
    if (grepMatch !== invertGrep) {
      return true;
    }
  };

  // Run specs in semi-random order
  if (jasmineNodeOpts.random) {
    jasmine.getEnv().randomizeTests(true);

    // Sets the randomization seed if randomization is turned on
    if (jasmineNodeOpts.seed) {
      jasmine.getEnv().seed(jasmineNodeOpts.seed);
    }
  }

  await runner.runTestPreparer();
  return new Promise((resolve, reject) => {
    if (jasmineNodeOpts && jasmineNodeOpts.defaultTimeoutInterval) {
      jasmine.DEFAULT_TIMEOUT_INTERVAL = jasmineNodeOpts.defaultTimeoutInterval;
    }

    const originalOnComplete = runner.getConfig().onComplete;

    jrunner.onComplete(async () => {
      try {
        if (originalOnComplete) {
          await originalOnComplete();
        }
        resolve({
          failedCount: reporter.failedCount,
          specResults: reporter.testResult
        });
      } catch (err) {
        reject(err);
      }
    });

    jrunner.configureDefaultReporter(jasmineNodeOpts);
    jrunner.projectBaseDir = '';
    jrunner.specDir = '';
    jrunner.addSpecFiles(specs);
    jrunner.execute();
  });
};
