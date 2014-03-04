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

var launcherPrefix = '[launcher] '

var log_ = function(stuff) {
  console.log(launcherPrefix + stuff);
}

var noLineLog_ = function(stuff) {
  process.stdout.write(launcherPrefix + stuff);
}


var reportHeader_ = function(childFork) {
  var capability = childFork.capability;
  var eol = require('os').EOL;

  var outputHeader = eol + '------------------------------------' + eol;;
  outputHeader += 'PID: ' + childFork.process.pid + ' (capability: ';
  outputHeader += (capability.browserName) ?
      capability.browserName : '';
  outputHeader += (capability.version) ?
      capability.version : '';
  outputHeader += (capability.platform) ?
      capability.platform : '';
  outputHeader += (childFork.runNumber) ?
      ' #' + childFork.runNumber : '';
  outputHeader += ')' + eol;
  outputHeader += '------------------------------------' + eol;


  util.puts(outputHeader);
};

/**
 * Initialize and run the tests.
 *
 * @param {Object} argv Optimist parsed arguments.
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

  var listRemainingForks = function() {
    var remaining = 0;
    childForks.forEach(function(childFork) {
      if (!childFork.done) {
        remaining++;
      }
    });
    if (remaining) {
      noLineLog_(remaining + ' instance(s) of WebDriver still running');
    }
  }

  if (config.multiCapabilities.length) {
    if (config.debug) {
      throw new Error('Cannot run in debug mode with multiCapabilities');
    }
    log_('Running using config.multiCapabilities - ' +
        'config.capabilities will be ignored');
  }

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
      childForks.push({
        cliArgs: argv,
        capability: config.multiCapabilities[i],
        runNumber: j + 1
      });
    }
  }

  // If we're launching multiple runners, aggregate output until completion.
  // Otherwise, there is a single runner, let's pipe the output straight
  // through to maintain realtime reporting.
  if (childForks.length === 1) {
    var childFork = childForks[0];
    childFork.process = child.fork(
        __dirname + "/runFromLauncher.js",
        process.argv.slice(2),
        {cwd: process.cwd()});
    reportHeader_(childFork);

    childFork.process.send({
      command: 'run',
      cliArgs: childFork.cliArgs,
      capability: childFork.capability
    });

    childFork.process.on('error', function(err) {
      log_('Runner Process(' + childFork.process.pid + ') Error: ' + err);
    });

    childFork.process.on('exit', function(code, signal) {
      if (code) {
        log_('Runner Process Exited With Error Code: ' + code);
        launcherExitCode = 1;
      }
    });
  } else {
    noLineLog_('Running ' + childForks.length +
        ' instances of WebDriver');

    // Launch each fork and set up listeners
    childForks.forEach(function(childFork) {

      childFork.process = child.fork(
          __dirname + "/runFromLauncher.js", [],
          {silent: true, cwd: process.cwd()});

      childFork.output = '';

      // stdin pipe
      childFork.process.stdout.on('data', function(chunk) {
        // Output something so processes know we haven't stalled.
        // TODO - consider replacing this with a message system which would
        // output a dot per test.
        process.stdout.write('.');
        childFork.output += chunk;
      });

      // stderr pipe
      childFork.process.stderr.on('data', function(chunk) {
        childFork.output += chunk;
      });

      // err handler
      childFork.process.on('error', function(err) {
        log_('Runner Process(' + childFork.process.pid + ') Error: ' + err);
      });

      // exit handlers
      childFork.process.on('exit', function(code, signal) {
        if (code) {
          log_('Runner Process Exited With Error Code: ' + code);
          launcherExitCode = 1;
        }
        reportHeader_(childFork);
        util.puts(childFork.output);
        childFork.done = true;
        listRemainingForks();
      });

      childFork.process.send({
        command: 'run',
        cliArgs: childFork.cliArgs,
        capability: childFork.capability
      });
    });
  }

  process.on('exit', function(code) {
    process.exit(launcherExitCode);
  });
};

exports.init = init;
