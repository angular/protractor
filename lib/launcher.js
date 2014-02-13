'use strict';

var util = require('util'),
    path = require('path'),
    fs = require('fs'),
    glob = require('glob'),
    child = require('child_process'),
    configParser = require('./configParser');


var reportHeader_ = function(proc,env) {
  var capability = JSON.parse(env.capability);
  var eol = require('os').EOL;

  var outputHeader = '------------------------------'+eol;
  outputHeader += 'PID: '+proc.pid+' (capability: ';
  outputHeader += (capability.browserName) ?
      capability.browserName : '';
  outputHeader += (capability.version) ?
      capability.version : '';
  outputHeader += (capability.platform) ?
      capability.platform : '';
  outputHeader += ')'+eol;
  outputHeader += '------------------------------';


  util.puts(outputHeader);
};

/**
 * Responsible for handling an input of capabilities and launching the test runs
 * appropriate config values and scanning directories for specs
 *
 * @param {Object} argv - Optimist parsed arguments
 */
var init = function(argv) {

  var i, j, capabilityRunCount, childForks = [], config;

  // Merge in config file options
  configParser.addFileConfig(argv._[0]);
  configParser.addArgvConfig(argv);
  config = configParser.getConfig();

  // Handle polymorphic param
  if (!Array.isArray(config.capabilities)) {
    config.capabilities = [config.capabilities];
  }

  // Loop through capabilities and launch forks of runner.js
  for (i=0; i<config.capabilities.length; i++) {

    // Determine how many times to run the capability
    capabilityRunCount = (config.capabilities[i].count) ?
        config.capabilities[i].count : 1;

    // Fork the child runners.
    for (j=0; j<capabilityRunCount; j++) {

      // We use an environment variable to retain the optimist parsed args and 
      // to tell the runner which capability its responsible for
      childForks.push({
        optimistArgs: JSON.stringify(argv),
        capability: JSON.stringify(config.capabilities[i])
      });
    }
  }

  // If we're launching multiple runners, aggregate output until completion.
  // Otherwise, there are multiple runners, let's pipe the output straight
  // through to maintain realtime reporting
  if(childForks.length === 1) {
    var childEnv = childForks.pop(),
        childProc = child.fork(__dirname+"/runner.js", [], {env: childEnv});
    reportHeader_(childProc, childEnv);
  }
  else {
    //Launch each fork and set up listeners
    childForks.forEach(function(childEnv) {

      var childProc = child.fork(__dirname+"/runner.js", [],
          {env: childEnv, silent: true});

      // Force evaluation to protect from loop changing closure in callbacks
      (function(childProc_, childEnv_) {
        childProc_._output = '';

        // stdin pipe
        childProc_.stdout.on('data', function(chunk) {
          childProc_._output += chunk;
        });

        // stderr pipe
        childProc_.stderr.on('data', function(chunk) {
          childProc_._output += chunk;
        });

        // err handler
        childProc_.on('error', function(err) {
          util.puts('Runner Process('+childProc_.pid+') Error: '+err);
        });

        // exit handler
        childProc_.on('exit', function(code,signal) {
          if (code) {
            util.puts('Runner Process Exited With Error Code: '+code);
          }
          reportHeader_(childProc_,childEnv_);
          util.puts(childProc_._output);
        });
      })(childProc, childEnv);

    });
  }
};

exports.init = init;
