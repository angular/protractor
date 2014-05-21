/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
'use strict';

var child = require('child_process'),
    ConfigParser = require('./configParser');

var launcherPrefix = '[launcher] ';

var log_ = function(stuff) {
  console.log(launcherPrefix + stuff);
};

var noLineLog_ = function(stuff) {
  process.stdout.write(launcherPrefix + stuff);
};
/**
 * Initialize and run the tests.
 *
 * @param {string=} configFile
 * @param {Object=} additionalConfig
 */
var init = function(configFile, additionalConfig) {

  // capabilities = array that holds one array per selected capability (Chrome, FF, Canary, ...)
  // This array holds all the instances of the capability
  var capabilities = [],
      launcherExitCode = 0,
      allSpecs,
      excludes;

  var configParser = new ConfigParser();
  if (configFile) {
    configParser.addFileConfig(configFile);
  }
  if (additionalConfig) {
    configParser.addConfig(additionalConfig);
  }
  var config = configParser.getConfig();

  var countDriverInstances = function() {
    var count = 0;
    capabilities.forEach(function(capabilityDriverInstances) {
      count += capabilityDriverInstances.length;
    });
    return count;
  };
  var countRunningDriverInstances = function() {
    var count = 0;
    capabilities.forEach(function(capabilityDriverInstances) {
      capabilityDriverInstances.forEach(function(driverInstance) {
        if (!driverInstance.done) {
          count += 1;
        }
      });
    });
    return count;
  };

  var listRemainingForks = function() {
    var remaining = countRunningDriverInstances();
    if (remaining) {
      noLineLog_(remaining + ' instance(s) of WebDriver still running');
    }
  };

  var logSummary = function() {
    capabilities.forEach(function(capabilityDriverInstances) {
      capabilityDriverInstances.forEach(function(driverInstance) {
        var shortChildName = driverInstance.capability.browserName +
          (driverInstance.runNumber ? ' #' + driverInstance.runNumber : '');
        if (driverInstance.failedCount) {
          log_(shortChildName + ' failed ' + driverInstance.failedCount + ' test(s)');
        } else {
          log_(shortChildName + ' passed');
        }
      });
    });
  };

  if (config.multiCapabilities.length) {
    if (config.debug) {
      throw new Error('Cannot run in debug mode with multiCapabilities');
    }
    log_('Running using config.multiCapabilities - ' +
         'config.capabilities will be ignored');
  }
  // Use capabilities if multiCapabilities is empty.
  if (!config.multiCapabilities.length) {
    config.multiCapabilities = [config.capabilities];
  }

  var Fork = function(configFile, additionalConfig, capability, specs, runNumber, single) {
    var silent = single ? false: true;

    this.configFile = configFile;
    this.additionalConfig = additionalConfig;
    this.capability = capability;
    this.runNumber = runNumber;
    this.single = single;
    this.specs = specs;

    this.process = child.fork(
      __dirname + '/runFromLauncher.js',
      process.argv.slice(2),{
        cwd: process.cwd(),
        silent: silent
      }
    );
  };

  Fork.prototype.reportHeader_ = function() {
    var capability = this.capability;
    var eol = require('os').EOL;
    var outputHeader = eol + '------------------------------------' + eol;
    outputHeader += 'PID: ' + this.process.pid + ' (capability: ';
    outputHeader += (capability.browserName) ?
      capability.browserName : '';
    outputHeader += (capability.version) ?
      capability.version : '';
    outputHeader += (capability.platform) ?
      capability.platform : '';
    outputHeader += (this.runNumber) ?
      ' #' + this.runNumber : '';
    outputHeader += ')' + eol;
    if (config.splitTestsBetweenCapabilities) {
      outputHeader += 'Specs: '+ this.specs.toString() + eol;
    }
    outputHeader += '------------------------------------' + eol;


    console.log(outputHeader);
  };

  // If we're launching multiple runners, aggregate output until completion.
  // Otherwise, there is a single runner, let's pipe the output straight
  // through to maintain realtime reporting.
  Fork.prototype.addEventHandlers = function(testsDoneCallback) {
    var self = this;
    if (this.single) {
      this.process.on('error', function(err) {
        log_('Runner Process(' + self.process.pid + ') Error: ' + err);
      });

      this.process.on('message', function(m) {
        switch (m.event) {
          case 'testsDone':
            this.failedCount = m.failedCount;
            break;
        }
      });

      this.process.on('exit', function(code) {
        if (code) {
          log_('Runner Process Exited With Error Code: ' + code);
          launcherExitCode = 1;
        }
      });
    } else {
      // Multiple capabilities and/or instances
      this.output = '';

      // stdin pipe
      this.process.stdout.on('data', function(chunk) {
        self.output += chunk;
      });

      // stderr pipe
      this.process.stderr.on('data', function(chunk) {
        self.output += chunk;
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
            self.failedCount = m.failedCount;
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
        self.reportHeader_();
        console.log(self.output);
        self.done = true;
        listRemainingForks();
      });
    }
  };

  Fork.prototype.run = function() {
    this.process.send({
      command: 'run',
      configFile: this.configFile,
      additionalConfig: this.additionalConfig,
      capability: this.capability,
      specs: this.specs
    });
  };

  excludes = ConfigParser.resolveFilePatterns( config.exclude, true, config.configDir);

  allSpecs = ConfigParser.resolveFilePatterns(
    ConfigParser.getSpecs(config), false, config.configDir).filter(function(path) {
    return excludes.indexOf(path) < 0;
  });

  // If there is a single capability with a single instance, avoid starting a separate process
  // and print output directly.
  // Otherwise, if we're launching multiple runners, aggregate output until
  // completion.
  if (config.multiCapabilities.length === 1 
      && (config.multiCapabilities[0].count === 1 || !config.multiCapabilities[0].count)) {
    var Runner = require('./runner');
    capabilities[0] = [{
      capability: config.multiCapabilities[0],
      runNumber: 0
    }];
    config.capabilities = capabilities[0][0].capability; 
    config.specs = allSpecs;

    var runner = new Runner(config);
    runner.run().then(function(exitCode) {
      process.exit(exitCode);
    }).catch(function(err) {
      log_('Error: ' + err.message);
      process.exit(1);
    });

    runner.on('testsDone', function(failedCount) {
      capabilities[0][0].failedCount = failedCount;
    });
  } else {
    // Loop over different capabilities in config file
    // Make array for each of them in capabilities array
    // Push driverInstances into this array, each with one spec (file!)
    // When a driverInstance finishes it's spec, it will create a new driver (Fork) 
    //   with the next spec in line 
    config.multiCapabilities.forEach(function(capability, index) {
      var forksCounter = 0;

      capability.count = capability.count || 1;

      capabilities[index] = []; // Matrix: Dim 1: Capabilities, Dim 2: Instances of capability
      if (allSpecs.length < capability.count && config.splitTestsBetweenCapabilities) {
        // When we split the specs over multiple instances, 
        //   we can have maximum as many instances as we have specs
        capability.count = allSpecs.length; 
      }

      while(forksCounter < capability.count) {
        if (config.splitTestsBetweenCapabilities) {
          var createAndRunPartialSpecFork = function() {
            var specs = allSpecs[forksCounter];
            if (!specs) {
              return;
            }
            var fork = new Fork(configFile,additionalConfig, 
                                capability,[specs],forksCounter+1,false);
            capabilities[index].push(fork);
            fork.run();
            fork.addEventHandlers(createAndRunPartialSpecFork);
            forksCounter++;
          };
          createAndRunPartialSpecFork();
        } else {
          var fork = new Fork(configFile, additionalConfig, 
                              capability, allSpecs, forksCounter+1, false);
          capabilities[index].push(fork);
          fork.run();
          fork.addEventHandlers();
          forksCounter++;
        }
      }
    });
  }
  noLineLog_('Running ' + countDriverInstances() +
             ' instances of WebDriver');

  process.on('exit', function(code) {
    if (code) {
      launcherExitCode = code;
    }
    logSummary();
    process.exit(launcherExitCode);
  });
};

exports.init = init;
