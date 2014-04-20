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
    Runner = require('./runner'),
    ConfigParser = require('./configParser');

var launcherPrefix = '[launcher] ';

var log_ = function(stuff) {
  console.log(launcherPrefix + stuff);
};

var noLineLog_ = function(stuff) {
  process.stdout.write(launcherPrefix + stuff);
};

var reportHeader_ = function(config) {
  var capability = config.capabilities;
  var eol = require('os').EOL;

  var outputHeader = eol + '------------------------------------' + eol;
  outputHeader += 'capability: ';
  outputHeader += (capability.browserName) ?
      capability.browserName : '';
  outputHeader += (capability.version) ?
      capability.version : '';
  outputHeader += (capability.platform) ?
      capability.platform : '';
  outputHeader += (config.runNumber) ?
      ' #' + config.runNumber : '';
  outputHeader += eol;
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
      batch = new Batch(),
      launcherExitCode = 0;

  var configParser = new ConfigParser();

  if (configFile) {
    configParser.addFileConfig(configFile);
  }
  if (additionalConfig) {
    configParser.addConfig(additionalConfig);
  }
  var config = configParser.getConfig();

  batch.concurrency(config.concurrency);

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
      console.log('Queing job');

      batch.push(function (done) {
        var runner = new Runner(config);

        runner.on('testsDone', function(failedCount) {
          if (failedCount) {
            log_(config.capabilities.browserName + ' failed ' + failedCount + ' test(s)');
          } else {
            log_(config.capabilities.browserName + ' passed');
          }
        });

        runner.run().then(function(exitCode) {
          done();
        }).catch(function(err) {
          console.log(err.message);
          done();
        });
      });

      batch.on('progress', function (e) {
        noLineLog_((e.total - e.complete)+ ' instance(s) of WebDriver still running');
        reportHeader_(config);
      });
    });

  //kicks off the actual batch as well as registering CBV
  batch.end(function (err, results) {

  });
};

exports.init = init;
