/**
 * The command line interface for interacting with the Protractor runner.
 * It takes care of parsing the config file and command line options.
 */

var util = require('util');
var path = require('path')
var fs = require('fs');
var runner = require('./runner.js');
var argv = require('optimist').
    usage('Usage: protractor [options] [config]').
    describe('version', 'Print Protractor version').
    describe('browser', 'Browsername, e.g. chrome or firefox').
    describe('seleniumAddress', 'A running seleium address to use').
    describe('seleniumServerJar', 'Location of the standalone selenium jar file').
    describe('seleniumPort', 'Optional port for the selenium standalone server').
    describe('baseUrl', 'URL to prepend to all relative paths').
    describe('rootElement', 'Element housing ng-app, if not html or body').
    describe('specs', 'Comma-separated list of files to test').
    describe('verbose', 'Print full spec names').
    describe('includeStackTrace', 'Print stack trace on error').
    describe('params', 'Param object to be passed to the tests').
    alias('browser', 'capabilities.browserName').
    alias('name', 'capabilities.name').
    alias('platform', 'capabilities.platform').
    alias('platform-version', 'capabilities.version').
    alias('tags', 'capabilities.tags').
    alias('build', 'capabilities.build').
    boolean('verbose').
    boolean('includeStackTrace').
    alias('verbose', 'jasmineNodeOpts.isVerbose').
    alias('includeStackTrace', 'jasmineNodeOpts.includeStackTrace').
    check(function(arg) {
      if (arg._.length > 1) {
        throw 'Error: more than one config file specified'
      }
      if (!(process.argv.length > 2)) {
        throw '';
      }
    }).
    argv;


var configPath;


var printVersion = function () {
  util.puts('Version ' + JSON.parse(
      fs.readFileSync(__dirname + '/../package.json', 'utf8')).version);
  process.exit(0);
};

if (argv.version) {
  printVersion();
}

if (argv.specs) {
  argv.specs = argv.specs.split(',');
  argv.specs.forEach(function(spec, index, arr) {
    arr[index] = path.resolve(process.cwd(), spec);
  });
}

var configFilename = argv._[0];
if (configFilename) {
  configPath = path.resolve(process.cwd(), configFilename);
  runner.addConfig(require(configPath).config);
  runner.addConfig({specFileBase: path.dirname(configPath)})
}

runner.addConfig(argv);

runner.runOnce();
