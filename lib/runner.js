'use strict';

var util = require('util'),
  path = require('path'),
  fs = require('fs'),
  glob = require('glob'),
  child = require('child_process');

// Default configuration.
var config = {
  configDir: './',
  jasmineNodeOpts: {}
};


/**
 * Merge config objects together.
 *
 * @param {Object} into
 * @param {Object} from
 *
 * @return {Object} The 'into' config.
 */
var merge = function(into, from) {
  for (var key in from) {
    if (into[key] instanceof Object && !(into[key] instanceof Array)) {
      merge(into[key], from[key]);
    } else {
      into[key] = from[key];
    }
  }
  return into;
};

/**
 * Add the options in the parameter config to this runner instance.
 *
 * @param {Object} additionalConfig
 */
var addConfig = function(additionalConfig) {
  // All filepaths should be kept relative to the current config location.
  // This will not affect absolute paths.
  ['seleniumServerJar', 'chromeDriver', 'onPrepare'].forEach(function(name) {
    if (additionalConfig[name] && additionalConfig.configDir &&
      typeof additionalConfig[name] === 'string') {
      additionalConfig[name] =
      path.resolve(additionalConfig.configDir, additionalConfig[name]);
    }
  });
  merge(config, additionalConfig);
};


/**
 * Resolve a list of file patterns into a list of individual file paths.
 *
 * @param {array} patterns
 * @param {boolean} opt_omitWarnings  whether to omit did not match warnings
 *
 * @return {array} The resolved file paths.
 */
var resolveFilePatterns = function(patterns, opt_omitWarnings) {
  var resolvedFiles = [];

  if (patterns) {
    for (var i = 0; i < patterns.length; ++i) {
      var matches = glob.sync(patterns[i], {cwd: config.configDir});
      if (!matches.length && !opt_omitWarnings) {
        util.puts('Warning: pattern ' + patterns[i] + ' did not match any files.');
      }
      for (var j = 0; j < matches.length; ++j) {
        resolvedFiles.push(path.resolve(config.configDir, matches[j]));
      }
    }
  }
  return resolvedFiles;
};


/**
 * Responsible for handling an input of capabilities and launching the test runs
 * appropriate config values and scanning directories for specs
 *
 * @param {Array} specs - Array of spec matchers
 */
var launchCapabilities = function(allCapabilities, argv) {
  var childArgv, childEnv, i, j, capabilityRunCount;

  //handle polymorphic param
  if(!Array.isArray(allCapabilities)) {
    allCapabilities = [allCapabilities];
  }

  for(i=0; i<allCapabilities.length; i++) {

    //setup the child environment
    childArgv = util._extend({}, argv);
    childArgv.capabilities = allCapabilities[i];
    childEnv = { argv: JSON.stringify(childArgv) };

    //determine how many times to run the capability
    capabilityRunCount = (allCapabilities[i].count) ?
      allCapabilities[i].count : 1;

    //fork the child runners
    for(j=0; j<capabilityRunCount; j++) {
      child.fork(__dirname + "/runner.js", process.argv,
        { stdio: 'inherit', env: childEnv});
    }
  }
};


/**
 * Run Protractor once.
 */
var initRunner = function() {
  var argv = JSON.parse(process.env.argv),
    configFilename = argv._[0],
    configPath = path.resolve(process.cwd(), configFilename),
    fileConfig,
    testRunner,
    testRunnerPath;

  //handle spec config
  if (config.jasmineNodeOpts.specFolders) {
    throw new Error('Using config.jasmineNodeOpts.specFolders is deprecated ' +
      'since Protractor 0.6.0. Please switch to config.specs.');
  }

  //if a config file was passed in, parse it and merge into config
  if (configFilename) {
    fileConfig = require(configPath).config;
    fileConfig.configDir = path.dirname(configPath);
    addConfig(fileConfig);
  }
  //add any command line arguments on top of that config
  addConfig(argv);

  var resolvedExcludes = resolveFilePatterns(config.exclude, true);
  var resolvedSpecs = resolveFilePatterns(config.specs).filter(function (path) {
    return resolvedExcludes.indexOf(path) < 0;
  });

  if (!resolvedSpecs.length) {
    throw new Error('Spec patterns did not match any files.');
  }


  //master path - trigger child processes based on capabilities needs
  if( process.env.firstRun ) {
    launchCapabilities(config.capabilities, argv);
  } else {
    //new testRunner system.
    //  - grab test runner based on type
    // Priority
    // 1) if chromeOnly, use that
    // 2) if seleniumAddress is given, use that
    // 3) if a sauceAccount is given, use that.
    // 4) if a seleniumServerJar is specified, use that
    // 5) try to find the seleniumServerJar in protractor/selenium
    if (config.chromeOnly) {
      testRunnerPath = __dirname+'/runners/chrome.runner';
    }
    else if(config.seleniumAddress) {
      testRunnerPath = __dirname+'/runners/hosted.runner';
    }
    else if (config.sauceUser && config.sauceKey) {
      testRunnerPath = __dirname+'/runners/sauce.runner';
    }
    else if (config.seleniumServerJar) {
      testRunnerPath = __dirname+'/runners/local.runner';
    }
    else {
      testRunnerPath = __dirname+'/runners/local.runner';
    }

    //override capabilities with those passed into the environment from parent(launcher)
    config.capabilities = argv.capabilities;

    //launch test run
    testRunner = require(testRunnerPath)(config);

    //register custom prep/cleanup jobs with testRunner
    if (config.onPrepare) {
      testRunner.registerTestPreparer(config.onPrepare);
    }
    if (config.onCleanup) {
      testRunner.registerTestCleaners(config.onCleanUp);
    }

    testRunner.run(resolvedSpecs);
  }
};

initRunner();
