"use strict";
var fs = require('fs');
var optimist = require('optimist');
var path = require('path');
/**
 * The command line interface for interacting with the Protractor runner.
 * It takes care of parsing command line options.
 *
 * Values from command line options override values from the config.
 */
var args = [];
process.argv.slice(2).forEach(function (arg) {
    var flag = arg.split('=')[0];
    switch (flag) {
        case 'debug':
            args.push('--nodeDebug');
            args.push('true');
            break;
        case '-d':
        case '--debug':
        case '--debug-brk':
            args.push('--v8Debug');
            args.push('true');
            break;
        default:
            args.push(arg);
            break;
    }
});
optimist
    .usage('Usage: protractor [configFile] [options]\n' +
    'configFile defaults to protractor.conf.js\n' +
    'The [options] object will override values from the config file.\n' +
    'See the reference config for a full list of options.')
    .describe('help', 'Print Protractor help menu')
    .describe('version', 'Print Protractor version')
    .describe('browser', 'Browsername, e.g. chrome or firefox')
    .describe('seleniumAddress', 'A running selenium address to use')
    .describe('seleniumSessionId', 'Attaching an existing session id')
    .describe('seleniumServerJar', 'Location of the standalone selenium jar file')
    .describe('seleniumPort', 'Optional port for the selenium standalone server')
    .describe('baseUrl', 'URL to prepend to all relative paths')
    .describe('rootElement', 'Element housing ng-app, if not html or body')
    .describe('specs', 'Comma-separated list of files to test')
    .describe('exclude', 'Comma-separated list of files to exclude')
    .describe('verbose', 'Print full spec names')
    .describe('stackTrace', 'Print stack trace on error')
    .describe('params', 'Param object to be passed to the tests')
    .describe('framework', 'Test framework to use: jasmine, mocha, or custom')
    .describe('resultJsonOutputFile', 'Path to save JSON test result')
    .describe('troubleshoot', 'Turn on troubleshooting output')
    .describe('elementExplorer', 'Interactively test Protractor commands')
    .describe('debuggerServerPort', 'Start a debugger server at specified port instead of repl')
    .alias('browser', 'capabilities.browserName')
    .alias('name', 'capabilities.name')
    .alias('platform', 'capabilities.platform')
    .alias('platform-version', 'capabilities.version')
    .alias('tags', 'capabilities.tags')
    .alias('build', 'capabilities.build')
    .alias('grep', 'jasmineNodeOpts.grep')
    .alias('invert-grep', 'jasmineNodeOpts.invertGrep')
    .alias('explorer', 'elementExplorer')
    .string('capabilities.tunnel-identifier')
    .check(function (arg) {
    if (arg._.length > 1) {
        throw 'Error: more than one config file specified';
    }
});
var argv = optimist.parse(args);
if (argv.help) {
    optimist.showHelp();
    process.exit(0);
}
if (argv.version) {
    console.log('Version ' + require(path.join(__dirname, '../package.json')).version);
    process.exit(0);
}
/**
 * Helper to resolve comma separated lists of file pattern strings relative to
 * the cwd.
 *
 * @private
 * @param {Array} list
 */
function processFilePatterns_(list) {
    return list.split(',').map(function (spec) {
        return path.resolve(process.cwd(), spec);
    });
}
;
if (argv.specs) {
    argv.specs = processFilePatterns_(argv.specs);
}
if (argv.exclude) {
    argv.exclude = processFilePatterns_(argv.exclude);
}
// Use default configuration, if it exists.
var configFile = argv._[0];
if (!configFile) {
    if (fs.existsSync('./protractor.conf.js')) {
        configFile = './protractor.conf.js';
    }
}
if (!configFile && !argv.elementExplorer && args.length < 3) {
    console.log('**you must either specify a configuration file ' +
        'or at least 3 options. See below for the options:\n');
    optimist.showHelp();
    process.exit(1);
}
// Run the launcher
var launcher = require('./launcher');
launcher.init(configFile, argv);
