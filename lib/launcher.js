/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
'use strict';

var util = require('util'),
    path = require('path'),
    child = require('child_process'),
    Batch = require('batch'),
    _ = require('lodash'),
    ConfigParser = require('./configParser');

var launcherPrefix = '[launcher] ';

var log_ = function(stuff) {
  console.log(launcherPrefix + stuff);
};

var noLineLog_ = function(stuff) {
  process.stdout.write(launcherPrefix + stuff);
};

var reportHeader_ = function(driverInstance) {
  var capability = driverInstance.capability;
  var eol = require('os').EOL;

  var outputHeader = eol + '------------------------------------' + eol;
  outputHeader += 'PID: ' + driverInstance.process.pid + ' (capability: ';
  outputHeader += (capability.browserName) ?
      capability.browserName : '';
  outputHeader += (capability.version) ?
      capability.version : '';
  outputHeader += (capability.platform) ?
      capability.platform : '';
  outputHeader += (driverInstance.runNumber) ?
      ' #' + driverInstance.runNumber : '';
  outputHeader += ')' + eol;
  outputHeader += '------------------------------------' + eol;


  console.log(outputHeader);
};

/**
 * Initialize and run the tests.
 *
 * @param {string=} configFile
 * @param {Object=} additionalConfig
 */
var init = function(configFile, additionalConfig) {

  var capabilityRunCount,
      driverInstances = new Batch(),
      launcherExitCode = 0;

  var configParser = new ConfigParser();

  if (configFile) {
    configParser.addFileConfig(configFile);
  }
  if (additionalConfig) {
    configParser.addConfig(additionalConfig);
  }
  var config = configParser.getConfig();

  driverInstances.concurrency(2);

  var listRemainingForks = function() {
    var remaining = 0;
    driverInstances.forEach(function(driverInstance) {
      if (!driverInstance.done) {
        remaining++;
      }
    });
    if (remaining) {
      noLineLog_(remaining + ' instance(s) of WebDriver still running');
    }
  };

  var logSummary = function() {
    driverInstances.forEach(function(driverInstance) {
      var shortChildName = driverInstance.capability.browserName +
          (driverInstance.runNumber ? ' #' + driverInstance.runNumber : '');
      if (driverInstance.failedCount) {
        log_(shortChildName + ' failed ' + driverInstance.failedCount + ' test(s)');
      } else {
        log_(shortChildName + ' passed');
      }
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

  //create list of jobs to run.
  _.chain(config.multiCapabilities)
    .map(function (cap) {
      var thisConfig = _.cloneDeep(config);
      thisConfig.capabilities = cap;
      return thisConfig;
    })
    .each(function(config) {
      console.log('starting config', config.capabilities, config.specs);
      driverInstances.push(function (done) {
        console.log('Starting job');
        setTimeout(function () {
          console.log('Finishing job');
          done();
        }, 2000);
      });
      driverInstances.on('progress', function (e) {
        noLineLog_(e.pending + ' instance(s) of WebDriver still running');
      });
    });

  driverInstances.end(function (err, results) {
    console.log('all config complete');
  });

// Loop through capabilities and set up forks of runner.js
//  for (var i = 0; i < config.multiCapabilities.length; i++) {
//
//    // Determine how many times to run the capability
//    capabilityRunCount = (config.multiCapabilities[i].count) ?
//        config.multiCapabilities[i].count : 1;
//
//    // Fork the child runners.
//    for (var j = 0; j < capabilityRunCount; j++) {
//      driverInstances.push({
//        configFile: configFile,
//        additionalConfig: additionalConfig,
//        capability: config.multiCapabilities[i],
//        runNumber: j + 1
//      });
//    }
//  }



  // Launch each fork and set up listeners
//  driverInstances.forEach(function(driverInstance) {
//
//    driverInstance.process = child.fork(
//        __dirname + "/runFromLauncher.js",
//        process.argv.slice(2),
//        {silent: true, cwd: process.cwd()});
//
//    driverInstance.output = '';
//
//    // stdin pipe
//    driverInstance.process.stdout.on('data', function(chunk) {
//      driverInstance.output += chunk;
//    });
//
//    // stderr pipe
//    driverInstance.process.stderr.on('data', function(chunk) {
//      driverInstance.output += chunk;
//    });
//
//    driverInstance.process.on('message', function(m) {
//      switch (m.event) {
//        case 'testPass':
//          process.stdout.write('.');
//          break;
//        case 'testFail':
//          process.stdout.write('F');
//          break;
//        case 'testsDone':
//          driverInstance.failedCount = m.failedCount;
//          break;
//      }
//    });
//
//    // err handler
//    driverInstance.process.on('error', function(err) {
//      log_('Runner Process(' + driverInstance.process.pid + ') Error: ' + err);
//    });
//
//    // exit handlers
//    driverInstance.process.on('exit', function(code, signal) {
//      if (code) {
//        log_('Runner Process Exited With Error Code: ' + code);
//        launcherExitCode = 1;
//      }
//      reportHeader_(driverInstance);
//      console.log(driverInstance.output);
//      driverInstance.done = true;
//      listRemainingForks();
//    });
//
//    driverInstance.process.send({
//      command: 'run',
//      configFile: driverInstance.configFile,
//      additionalConfig: driverInstance.additionalConfig,
//      capability: driverInstance.capability
//    });
//
//    process.on('exit', function(code) {
//      if (code) {
//        launcherExitCode = code;
//      }
//      logSummary();
//      process.exit(launcherExitCode);
//    });
//  });
};

exports.init = init;
