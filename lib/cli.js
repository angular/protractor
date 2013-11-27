/**
 * The command line interface for interacting with the Protractor runner.
 * It takes care of parsing the config file and command line options.
 *
 * Values from command line options override values from the config.
 */

var util = require('util');
var path = require('path')
var fs = require('fs');
var runner = require('./runner.js');
var argv = require('optimist').
    usage('Usage: protractor [options] [configFile]\n' +
        'The [options] object will override values from the config file.\n' +
        'See the reference config for a full list of options.').
    describe('version', 'Print Protractor version').
    describe('browser', 'Browsername, e.g. chrome or firefox').
    describe('seleniumAddress', 'A running seleium address to use').
    describe('seleniumServerJar', 'Location of the standalone selenium jar file').
    describe('seleniumPort', 'Optional port for the selenium standalone server').
    describe('baseUrl', 'URL to prepend to all relative paths').
    describe('rootElement', 'Element housing ng-app, if not html or body').
    describe('specs', 'Comma-separated list of files to test').
    describe('verbose', 'Print full spec names').
    describe('stackTrace', 'Print stack trace on error').
    describe('params', 'Param object to be passed to the tests').
    alias('browser', 'capabilities.browserName').
    alias('name', 'capabilities.name').
    alias('platform', 'capabilities.platform').
    alias('platform-version', 'capabilities.version').
    alias('tags', 'capabilities.tags').
    alias('build', 'capabilities.build').
    alias('verbose', 'jasmineNodeOpts.isVerbose').
    alias('stackTrace', 'jasmineNodeOpts.includeStackTrace').
    check(function(arg) {
      if (arg._.length > 1) {
        throw 'Error: more than one config file specified'
      }
      if (!(process.argv.length > 2)) {
        throw '';
      }
    }).
    argv;

var printVersion = function () {
  util.puts('Version ' + JSON.parse(
      fs.readFileSync(__dirname + '/../package.json', 'utf8')).version);
  process.exit(0);
};

if (argv.version) {
  printVersion();
}

// Any file names should be resolved relative to the current working directory.
if (argv.specs) {
  argv.specs = argv.specs.split(',');
  argv.specs.forEach(function(spec, index, arr) {
    arr[index] = path.resolve(process.cwd(), spec);
  });
}
['seleniumServerJar', 'chromeDriver', 'onPrepare'].forEach(function(name) {
  if (argv[name]) {
    argv[name] = path.resolve(process.cwd(), argv[name]);
  }
});

var configFilename = argv._[0];
if (configFilename) {
  var configPath = path.resolve(process.cwd(), configFilename);
  config = require(configPath).config;
  config.configDir = path.dirname(configPath);
  runner.addConfig(config);
}

runner.addConfig(argv);

runner.runOnce();
