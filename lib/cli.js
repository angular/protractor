/**
 * The command line interface for interacting with the Protractor runner.
 * It takes care of parsing the config file and command line options.
 *
 * Values from command line options override values from the config.
 */
'use strict';

// Coffee is required here to enable config files written in coffee-script.
// It's not directly used in this file, and not required.
try {
  require('coffee-script').register();
} catch (e) {
  // Intentionally blank - ignore if coffee-script is not available.
}

// LiveScript is required here to enable config files written in LiveScript.
// It's not directly used in this file, and not required.
try {
  require('LiveScript');
} catch (e) {
  // Intentionally blank - ignore if LiveScript is not available.
}

var util = require('util');
var path = require('path');
var runner = require('./runner.js');
var argv = require('optimist').
    usage('Usage: protractor [options] [configFile]\n' +
        'The [options] object will override values from the config file.\n' +
        'See the reference config for a full list of options.').
    describe('help', 'Print Protractor help menu').
    describe('version', 'Print Protractor version').
    describe('browser', 'Browsername, e.g. chrome or firefox').
    describe('seleniumAddress', 'A running seleium address to use').
    describe('seleniumServerJar', 'Location of the standalone selenium jar file').
    describe('seleniumPort', 'Optional port for the selenium standalone server').
    describe('baseUrl', 'URL to prepend to all relative paths').
    describe('rootElement', 'Element housing ng-app, if not html or body').
    describe('specs', 'Comma-separated list of files to test').
    describe('exclude', 'Comma-separated list of files to exclude').
    describe('verbose', 'Print full spec names').
    describe('stackTrace', 'Print stack trace on error').
    describe('params', 'Param object to be passed to the tests').
    describe('framework', 'Test framework to use. jasmine or mocha.').
    alias('browser', 'capabilities.browserName').
    alias('name', 'capabilities.name').
    alias('platform', 'capabilities.platform').
    alias('platform-version', 'capabilities.version').
    alias('tags', 'capabilities.tags').
    alias('build', 'capabilities.build').
    alias('verbose', 'jasmineNodeOpts.isVerbose').
    alias('stackTrace', 'jasmineNodeOpts.includeStackTrace').
    string('capabilities.tunnel-identifier').
    check(function(arg) {
      if (arg._.length > 1) {
        throw 'Error: more than one config file specified';
      }
      if (process.argv.length < 3 || arg.help) {
        throw '';
      }
    }).
    argv;

if (argv.version) {
  util.puts('Version ' + require(path.join(__dirname, '../package.json')).version);
  process.exit(0);
}


// Any file names should be resolved relative to the current working directory.
var processFilePatterns = function(list) {
  var patterns = list.split(',');
  patterns.forEach(function(spec, index, arr) {
    arr[index] = path.resolve(process.cwd(), spec);
  });
  return patterns;
}
if (argv.specs) {
  argv.specs = processFilePatterns(argv.specs);
}
if (argv.exclude) {
  argv.exclude = processFilePatterns(argv.exclude);
}

['seleniumServerJar', 'chromeDriver', 'onPrepare'].forEach(function(name) {
  if (argv[name]) {
    argv[name] = path.resolve(process.cwd(), argv[name]);
  }
});

var configFilename = argv._[0];
if (configFilename) {
  var configPath = path.resolve(process.cwd(), configFilename);
  var config = require(configPath).config;
  config.configDir = path.dirname(configPath);
  runner.addConfig(config);
}

runner.addConfig(argv);

runner.runOnce();
