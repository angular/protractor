/**
 * The launcher is responsible for parsing the capabilities from the
 * input configuration and launching test runners.
 */
 'use strict';

var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    child = require('child_process'),
    ConfigParser = require('./configParser');


var reportHeader_ = function(proc, env) {
  var capability = JSON.parse(env.capability);
  var eol = require('os').EOL;

  var outputHeader = eol + '------------------------------' + eol;
  outputHeader += 'PID: ' + proc.pid + ' (capability: ';
  outputHeader += (capability.browserName) ?
      capability.browserName : '';
  outputHeader += (capability.version) ?
      capability.version : '';
  outputHeader += (capability.platform) ?
      capability.platform : '';
  outputHeader += (env.runNumber) ?
      ' #' + env.runNumber : '';
  outputHeader += ')' + eol;
  outputHeader += '------------------------------';


  util.puts(outputHeader);
};

/**
 * Initialize and run the tests.
 *
 * @param {Object} argv - Optimist parsed arguments
 */
var init = function(argv) {

  var capabilityRunCount,
      childForks = [],
      config,
      launcherExitCode = 0;

  config = new ConfigParser().
      addFileConfig(argv._[0]).
      addConfig(argv).
      getConfig();

  // Merge 'capabilities' and 'multiCapabilities', if applicable.
  if (!config.multiCapabilities.length) {
    config.multiCapabilities = [config.capabilities];
  }

  // Loop through capabilities and launch forks of runner.js
  for (var i = 0; i < config.multiCapabilities.length; i++) {

    // Determine how many times to run the capability
    capabilityRunCount = (config.multiCapabilities[i].count) ?
        config.multiCapabilities[i].count : 1;

    // Fork the child runners.
    for (var j = 0; j < capabilityRunCount; j++) {

      // We use an environment variable to retain the optimist parsed args and 
      // to tell the runner which capability its responsible for
      childForks.push({
        cliArgs: JSON.stringify(argv),
        capability: JSON.stringify(config.multiCapabilities[i]),
        runNumber: j + 1
      });
    }
  }

  // If we're launching multiple runners, aggregate output until completion.
  // Otherwise, there are multiple runners, let's pipe the output straight
  // through to maintain realtime reporting.
  if (childForks.length === 1) {
    var childEnv = childForks.pop(),
        childProc = child.fork(__dirname + "/runFromLauncher.js", [],
            {env: childEnv,
             cwd: process.cwd()});
    reportHeader_(childProc, childEnv);
    childProc.on('error', function(err) {
      util.puts('Runner Process(' + childProc.pid + ') Error: ' + err);
    });

    childProc.on('exit', function(code, signal) {
      if (code) {
        util.puts('Runner Process Exited With Error Code: ' + code);
        launcherExitCode = 1;
      }
    });
  } else {
    process.stdout.write('Running ' + childForks.length + ' instances of WebDriver');

    // Launch each fork and set up listeners
    childForks.forEach(function(childEnv) {

      var childProc = child.fork(__dirname + "/runFromLauncher.js", [],
          {env: childEnv, silent: true, cwd: process.cwd()});

      // Force evaluation to protect from loop changing closure in callbacks
      (function(childProc_, childEnv_) {
        childProc_.output = '';

        // stdin pipe
        childProc_.stdout.on('data', function(chunk) {
          // Output something so processes know we haven't stalled.
          // TODO - consider replacing this with a message system which would
          // output a dot per test.
          process.stdout.write('.');
          childProc_.output += chunk;
        });

        // stderr pipe
        childProc_.stderr.on('data', function(chunk) {
          childProc_.output += chunk;
        });

        // err handler
        childProc_.on('error', function(err) {
          util.puts('Runner Process(' + childProc_.pid + ') Error: ' + err);
        });

        // exit handlers
        childProc_.on('exit', function(code, signal) {
          if (code) {
            util.puts('Runner Process Exited With Error Code: ' + code);
            launcherExitCode = 1;
          }
          reportHeader_(childProc_, childEnv_);
          util.puts(childProc_.output);
        });
      })(childProc, childEnv);
    });
  }

  process.on('exit', function(code) {
    process.exit(launcherExitCode);
  });
};

exports.init = init;
