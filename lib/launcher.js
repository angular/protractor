/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
'use strict';

var child = require('child_process'),
    ConfigParser = require('./configParser'),
    SessionScheduler = require('./sessionScheduler');

/**
 * Initialize and run the tests.
 *
 * @param {string=} configFile
 * @param {Object=} additionalConfig
 */
var init = function(configFile, additionalConfig) {

  // capabilities = array that holds one array per selected capability (Chrome, FF, Canary, ...)
  // This array holds all the instances of the capability
  var launcherExitCode = 0;

  var configParser = new ConfigParser();
  if (configFile) {
    configParser.addFileConfig(configFile);
  }
  if (additionalConfig) {
    configParser.addConfig(additionalConfig);
  }
  var config = configParser.getConfig();
  var scheduler = new SessionScheduler(config);

  // Use single process for debug mode
  if (config.debug) {
    if (config.splitTestsBetweenCapabilities || config.multiCapabilities.length) {
      throw new Error('Cannot run in debug mode with ' + 
        'multiCapabilities or splitTestsBetweenCapabilities');
    }
    var Runner = require('./runner');
    var session = scheduler.nextSession();
    config.capabilities = session.capability; 
    config.specs = session.specs;

    var runner = new Runner(config);
    runner.run().then(function(exitCode) {
      process.exit(exitCode);
    }).catch(function(err) {
      log_('Error: ' + err.message);
      process.exit(1);
    });
  }

  var Fork = function(session, realtimeReporting) {
    this.capability = session.capability;
    this.specs = session.specs;
    this.process = child.fork(
      __dirname + '/runFromLauncher.js',
      process.argv.slice(2),{
        cwd: process.cwd(),
        silent: true
      }
    );
    this.reporter = reporter.initReporter(session, this.process.pid, realtimeReporting);
  };

  // If we're launching multiple runners, aggregate output until completion.
  // Otherwise, there is a single runner, let's pipe the output straight
  // through to maintain realtime reporting.
  Fork.prototype.addEventHandlers = function(testsDoneCallback) {
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
        case 'testsDone':
          self.reporter.testsDone(m.failedCount);
          if (typeof testsDoneCallback === 'function') {
            testsDoneCallback();
          }
          break;
      }
    });

    // err handler
    this.process.on('error', function(err) {
      log_('Runner Process(' + self.process.pid + ') Error: ' + err);
    });

    // exit handlers
    this.process.on('exit', function(code) {
      if (code) {
        log_('Runner Process Exited With Error Code: ' + code);
        launcherExitCode = 1;
      }
      log_(scheduler.countActiveSessions() + 
        ' instance(s) of WebDriver still running');
    }); 
  };

  Fork.prototype.run = function() {
    var self = this;
    this.process.send({
      command: 'run',
      configFile: configFile,
      additionalConfig: additionalConfig,
      capability: self.capability,
      specs: self.specs
    });
    this.reporter._reportHeader();
  };

  var realtimeReporting = scheduler.maxSessions() === 1 ? true : false;
  for (var i = 0; i < scheduler.maxSessions(); ++i) {
    var createAndRunPartialSpecFork = function() {
      var session = scheduler.nextSession();
      if (session) {
        var done = function() {
          session.done();
          createAndRunPartialSpecFork();
        };
        var fork = new Fork(session, realtimeReporting);
        fork.addEventHandlers(done);
        fork.run(done);
      }
    };
    createAndRunPartialSpecFork();
  }
  log_('Running ' + scheduler.countActiveSessions() + ' instances of WebDriver');

  process.on('exit', function(code) {
    if (scheduler.numSessionsRemaining() > 0) {
      throw new Error('BUG: launcher exited with ' + 
        scheduler.numSessionsRemaining() + ' sessions remaining');
    }
    if (code) {
      launcherExitCode = code;
    }
    reporter.reportSummary();
    process.exit(launcherExitCode);
  });
};

//###### REPORTER #######//
var reporter = {
  _sessionReporters: [],

  initReporter: function(session, pid, realtimeReporting) {
    var sessionReporter = new SessionReporter_(session, pid, realtimeReporting);
    this._sessionReporters.push(sessionReporter);
    return sessionReporter;
  },

  reportSummary: function() {
    this._sessionReporters.forEach(function(sessionReporter) {
      var shortName = sessionReporter.session.capability.browserName + 
        ' #' + sessionReporter.session.sessionId;
      if (sessionReporter.failedCount) {
        log_(shortName + ' failed ' + sessionReporter.failedCount + ' test(s)');
      } else {
        log_(shortName + ' passed');
      }
    });
  }
};

var SessionReporter_ = function(session, pid, realtimeReporting) {
  this.session = session;
  this.pid = pid;
  this.failedCount = 0;
  this.buffer = '';
  this.realtimeReporting = realtimeReporting;
};

SessionReporter_.prototype._reportHeader = function() {
  var capability = this.session.capability;
  var eol = require('os').EOL;
  var output = '------------------------------------' + eol;
  output += 'PID: ' + this.pid + ' (capability: ';
  output += (capability.browserName) ?
    capability.browserName : '';
  output += (capability.version) ?
    capability.version : '';
  output += (capability.platform) ?
    capability.platform : '';
  output += (' #' + this.session.sessionId);
  output += ')' + eol;
  if (this.session.specs.length === 1) {
    output += 'Specs: '+ this.session.specs.toString() + eol;
  }
  this._log(output);
};

SessionReporter_.prototype.logStdout = function(stdout) {
  this._log(stdout);
};

SessionReporter_.prototype.logStderr = function(stderr) {
  this._log(stderr);
};

SessionReporter_.prototype.testsDone = function(failedCount) {
  this.failedCount = failedCount;
  if (this.buffer) {
    // Flush buffer if nonempty
    process.stdout.write(this.buffer);
  }
};

SessionReporter_.prototype._log = function(data) {
  if (this.realtimeReporting) {
    process.stdout.write(data.toString());
  } else {
    this.buffer += data;
  }
};

var log_ = function(stuff) {
  console.log('[launcher] ' + stuff);
};

exports.init = init;
