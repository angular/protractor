/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
'use strict';

var child = require('child_process'),
    ConfigParser = require('./configParser'),
    TaskScheduler = require('./taskScheduler');

var launcherPrefix = '[launcher] ';
var RUNNERS_FAILED_EXIT_CODE = 100;

var log_ = function(stuff) {
  console.log(launcherPrefix + stuff);
};

/**
 * Initialize and run the tests.
 *
 * @param {string=} configFile
 * @param {Object=} additionalConfig
 */
var init = function(configFile, additionalConfig) {

  var runnerErrorCount = 0; 

  var configParser = new ConfigParser();
  if (configFile) {
    configParser.addFileConfig(configFile);
  }
  if (additionalConfig) {
    configParser.addConfig(additionalConfig);
  }
  var config = configParser.getConfig();
  var scheduler = new TaskScheduler(config);

  /**
   * A fork of a runner for running a specified task. The RunnerFork will
   * start a new process that calls on '/runFromLauncher.js' and report the
   * result to a reporter.
   *
   * @constructor
   * @param {object} task Task to run.
   */
  var RunnerFork = function(task) {
    this.capability = task.capability;
    this.specs = task.specs;
    this.process = child.fork(
      __dirname + '/runFromLauncher.js',
      process.argv.slice(2), {
        cwd: process.cwd(),
        silent: true
      }
    );
    this.reporter = reporter.addTaskReporter(task, this.process.pid);
  };

  /**
   * Add handlers for the RunnerFork for events like stdout, stderr, testsDone,
   * testPass, testFail, error, and exit. Optionally, you can pass in a 
   * callback function to be called when a test completes.
   *
   * @param {function()} testsDoneCallback Callback function for testsDone events.
   */
  RunnerFork.prototype.addEventHandlers = function(testsDoneCallback) {
    var self = this;

    // stdout pipe
    this.process.stdout.on('data', function(chunk) {
      self.reporter.logStdout(chunk);
    });

    // stderr pipe
    this.process.stderr.on('data', function(chunk) {
      self.reporter.logStderr(chunk);
    });

    this.process.on('message', function(m) {
      switch (m.event) {
        case 'testPass':
          process.stdout.write('.');
          break;
        case 'testFail':
          process.stdout.write('F');
          break;
        case 'testsDone':
          self.reporter.testsDone(m.failedCount);
          if (typeof testsDoneCallback === 'function') {
            testsDoneCallback();
          }
          break;
      }
    });

    this.process.on('error', function(err) {
      self.reporter.flush();
      log_('Runner Process(' + self.process.pid + ') Error: ' + err);
      runnerErrorCount += 1; 
    });

    this.process.on('exit', function(code) {
      self.reporter.flush();
      if (code) {
        log_('Runner Process Exited With Error Code: ' + code);
        runnerErrorCount += 1;
      }
      log_(scheduler.countActiveTasks() + 
        ' instance(s) of WebDriver still running');
    }); 
  };

  /**
   * Sends the run command.
   */
  RunnerFork.prototype.run = function() {
    this.process.send({
      command: 'run',
      configFile: configFile,
      additionalConfig: additionalConfig,
      capability: this.capability,
      specs: this.specs
    });
    this.reporter.reportHeader_();
  };

  // Don't start new process if there is only 1 task.
  var totalTasks = scheduler.numTasksRemaining(); 
  if (totalTasks === 1) {
    var Runner = require('./runner');
    var task = scheduler.nextTask();
    config.capabilities = task.capability; 
    config.specs = task.specs;

    var runner = new Runner(config);
    runner.run().then(function(exitCode) {
      process.exit(exitCode);
    }).catch(function(err) {
      log_('Error: ' + err.message);
      process.exit(1);
    });
  } else {
    if (config.debug) {
      throw new Error('Cannot run in debug mode with ' + 
        'multiCapabilities, count > 1, or sharding');
    }
    for (var i = 0; i < scheduler.maxConcurrentTasks(); ++i) {
      var createNextRunnerFork = function() {
        var task = scheduler.nextTask();
        if (task) {
          var done = function() {
            task.done();
            createNextRunnerFork();
          };
          var runnerFork = new RunnerFork(task);
          runnerFork.addEventHandlers(done);
          runnerFork.run();
        }
      };
      createNextRunnerFork();
    }
    log_('Running ' + scheduler.countActiveTasks() + ' instances of WebDriver');

    process.on('exit', function(code) {
      if (code) {
        log_('Process exited with error code ' + code);
        process.exit(code);
      } else if (runnerErrorCount > 0) {
        reporter.reportSummary();
        process.exit(RUNNERS_FAILED_EXIT_CODE);
      } else {
        if (scheduler.numTasksRemaining() > 0) {
          throw new Error('BUG: launcher exited with ' + 
              scheduler.numTasksRemaining() + ' tasks remaining');
        }
        reporter.reportSummary();
        process.exit(0);
      }
    });
  }
};

//###### REPORTER #######//
/**
 * Keeps track of a list of task reporters. Provides method to add a new 
 * reporter and to aggregate the reports into a summary. 
 */
var reporter = {
  taskReporters_: [],

  addTaskReporter: function(task, pid) {
    var taskReporter = new TaskReporter_(task, pid);
    this.taskReporters_.push(taskReporter);
    return taskReporter;
  },

  reportSummary: function() {
    var totalFailures = 0;
    this.taskReporters_.forEach(function(taskReporter) {
      var capability = taskReporter.task.capability;
      var shortName = (capability.browserName) ? capability.browserName : '';
      shortName += (capability.version) ? capability.version : '';
      shortName += (' #' + taskReporter.task.taskId);
      if (taskReporter.failedCount) {
        log_(shortName + ' failed ' + taskReporter.failedCount + ' test(s)');
        totalFailures += taskReporter.failedCount;
      } else {
        log_(shortName + ' passed');
      }
    });
    if (this.taskReporters_.length > 1 && totalFailures) {
      log_('overall: ' + totalFailures + ' failure(s)');
    }
  }
};

/**
 * A reporter for a specific task.
 *
 * @constructor
 * @param {object} task Task that is being reported.
 * @param {number} pid PID of process running the task.
 */
var TaskReporter_ = function(task, pid) {
  this.task = task;
  this.pid = pid;
  this.failedCount = 0;
  this.buffer = '';
  this.insertTag = true;
};

/**
 * Report the header for the current task including information such as
 * PID, browser name/version, task Id, specs being run.
 */
TaskReporter_.prototype.reportHeader_ = function() {
  var eol = require('os').EOL;
  var output = 'PID: ' + this.pid + eol;
  if (this.task.specs.length === 1) {
    output += 'Specs: '+ this.task.specs.toString() + eol + eol;
  }
  this.log_(output);
};

/**
 * Log the stdout. The reporter is responsible for reporting this data when 
 * appropriate.
 *
 * @param {string} stdout Stdout data to log
 */
TaskReporter_.prototype.logStdout = function(stdout) {
  this.log_(stdout);
};

/**
 * Log the stderr. The reporter is responsible for reporting this data when 
 * appropriate.
 * 
 * @param {string} stderr Stderr data to log
 */
TaskReporter_.prototype.logStderr = function(stderr) {
  this.log_(stderr);
};

/**
 * Signal that the task is completed. This must be called at the end of a task. 
 * 
 * @param {number} failedCount Number of failures
 */
TaskReporter_.prototype.testsDone = function(failedCount) {
  this.failedCount = failedCount;
  this.flush();
};

/**
 * Flushes the buffer to stdout.
 */
TaskReporter_.prototype.flush = function() {
  if (this.buffer) {
    // Flush buffer if nonempty
    var eol = require('os').EOL;
    process.stdout.write(eol + '------------------------------------' + eol);
    process.stdout.write(this.buffer);
    process.stdout.write(eol);
    this.buffer = '';
  }
};

/**
 * Report the following data. The data will be saved to a buffer
 * until it is flushed by the function testsDone. 
 *
 * @private
 * @param {string} data 
 */
TaskReporter_.prototype.log_ = function(data) {
  var tag = '[';
  var capability = this.task.capability;
  tag += (capability.browserName) ?
    capability.browserName : '';
  tag += (capability.version) ?
    (' ' +  capability.version) : '';
  tag += (capability.platform) ?
    (' ' + capability.platform) : '';
  tag += (' #' + this.task.taskId);
  tag += '] ';


  data = data.toString();
  for ( var i = 0; i < data.length; i++ ) {
    if (this.insertTag) {
      this.insertTag = false;
      this.buffer += tag;
    }
    if (data[i] === '\n') {
      this.insertTag = true;
      this.buffer += '\x1B[0m'; // Prevent color from leaking into next line
    }
    this.buffer += data[i];
  }
};

exports.init = init;
