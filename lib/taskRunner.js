var child = require('child_process');
var q = require('q');
var TaskLogger = require('./taskLogger.js');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var log = require('./logger.js');


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
var TaskRunner = function(configFile, additionalConfig, task, runInFork) {
  this.configFile = configFile;
  this.additionalConfig = additionalConfig;
  this.task = task;
  this.runInFork = runInFork;
};
util.inherits(TaskRunner, EventEmitter);

/**
 * Sends the run command.
 * @return {q.Promise} A promise that will resolve when the task finishes
 *     running. The promise contains the following parameters representing the
 *     result of the run:
 *       taskId, specs, capabilities, failedCount, exitCode, specResults
 */
TaskRunner.prototype.run = function() {
  var deferred = q.defer();

  var maxRetries = 3;
  var retries = 0;

  var self = this;

  // Running processes in fork is much more predictable when we want to retry them. Using it by default
  // even with only 1 spec in queue.
  this.runInFork = true;

  var taskLogger = new TaskLogger(this.task, process.pid);
  var runnerFn = this.runInFork ? this._runForked : this._runNormal;

  var runSpecHelper = function() {

    if (retries > 0) {
      taskLogger.log('Task failed, retrying (' + retries + '/' + maxRetries + ')');
      taskLogger.flush();
    }

    retries++;

    var runResults = {
      taskId: self.task.taskId,
      specs: self.task.specs,
      capabilities: self.task.capabilities,
      // The following are populated while running the test:
      failedCount: 0,
      exitCode: -1,
      specResults: []
    };

    runnerFn.call(self, runResults).then(function() {
      // console.log('runnerFn then, retries: %d, failed: %d, exit code: %d', retries, runResults.failedCount, runResults.exitCode);

      if ((runResults.failedCount > 0 || runResults.exitCode == 1) && retries <= maxRetries)
        return runSpecHelper();

      // TaskLogger.flush prints task output to the screen. The reason we don't do it in `_runForked` is
      // we want to avoid non-sense output. If task failed, retried and succedeed we don't want to
      // print any information about errors.
      runResults.taskLogger.flush();
      deferred.resolve(runResults);

    }).catch(function(err) {
      taskLogger.log('Protractor runtime error, very likely it is not critical:' + err);
      taskLogger.flush();

      if (retries <= maxRetries)
        return runSpecHelper();

      runResults.taskLogger.flush();
      deferred.reject(err);
    })
  }

  runSpecHelper();

  return deferred.promise;
};


TaskRunner.prototype._runForked = function(runResults) {
  var deferred = q.defer();
  var self = this;

  var childProcess = child.fork(
    __dirname + '/runnerCli.js',
    process.argv.slice(2), {
      cwd: process.cwd(),
      silent: true
    }
  );
  var taskLogger = new TaskLogger(this.task, childProcess.pid);

  // TODO: It's a little ugly carry logger like this
  runResults.taskLogger = taskLogger;

  // stdout pipe
  childProcess.stdout.on('data', function(data) {
    taskLogger.log(data);
  });

  // stderr pipe
  childProcess.stderr.on('data', function(data) {
    taskLogger.log(data);
  });

  childProcess.on('message', function(m) {
    // console.log('zzz msg', self.task.taskId, m.event);
    switch (m.event) {
      case 'testPass':
        log.print('.');
        break;
      case 'testFail':
        log.print('F');
        break;
      case 'testsDone':
        runResults.failedCount = m.results.failedCount;
        runResults.specResults = m.results.specResults;
        break;
    }
  })
  .on('error', function(err) {
    // console.log('zzz error', self.task.taskId, err);
    // taskLogger.flush();
    deferred.reject(err);
  })
  .on('exit', function(code) {
    // console.log('zzz exit', self.task.taskId, code);
    // taskLogger.flush();
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
};


TaskRunner.prototype._runNormal = function(runResults) {
  var deferred = q.defer();

  var ConfigParser = require('./configParser');
  var configParser = new ConfigParser();
  if (this.configFile) {
    configParser.addFileConfig(this.configFile);
  }
  if (this.additionalConfig) {
    configParser.addConfig(this.additionalConfig);
  }
  var config = configParser.getConfig();
  config.capabilities = this.task.capabilities;
  config.specs = this.task.specs;

  var Runner = require('./runner');
  var runner = new Runner(config);

  runner.on('testsDone', function(results) {
    runResults.failedCount = results.failedCount;
    runResults.specResults = results.specResults;
  });

  runner.run().then(function(exitCode) {
    runResults.exitCode = exitCode;
    // return runResults;
    deferred.resolve(runResults)
  }).catch(function(err) {
    deferred.reject(err)
  });

  return deferred.promise
};

module.exports = TaskRunner;
