#!/usr/bin/env node

/**
 * This is an explorer to help get the right element locators, and test out what
 * Protractor commands will do on your site without running a full test suite.
 *
 * This beta version only uses the Chrome browser.
 *
 * Usage:
 *
 * Expects a selenium standalone server to be running at http://localhost:4444
 * from protractor directory, run with:
 *
 *     ./bin/elementexplorer.js <urL>
 *
 * This will load up the URL on webdriver and put the terminal into a REPL loop.
 * You will see a > prompt. The `browser`, `element` and `protractor` variables
 * will be available. Enter a command such as:
 *
 *     > element(by.id('foobar')).getText()
 *
 * or
 *
 *     > browser.get('http://www.angularjs.org')
 *
 * try just
 *
 *     > browser
 *
 * to get a list of functions you can call.
 *
 * Typing tab at a blank prompt will fill in a suggestion for finding
 * elements.
 */

var webdriver = require('selenium-webdriver');
var protractor = require('../lib/protractor.js');
var ConfigParser = require('../lib/configParser');
var Runner = require('../lib/runner');
var repl = require('repl');
var util = require('util');
var vm = require('vm');

var optimist = require('optimist').
    usage('Usage: $0 [options] [url]\n').
    describe('help', 'Print Protractor help menu').
    describe('chromeOnly', 'Use chromedriver directly').
    describe('configFile', 'Initialize browser using protractors\' configFile').
    describe('browser', 'Browsername, e.g. chrome or firefox').
    describe('seleniumAddress', 'A running seleium address to use').
    describe('seleniumServerJar', 'Location of the standalone selenium jar file').
    describe('seleniumPort', 'Optional port for the selenium standalone server').
    describe('baseUrl', 'URL to prepend to all relative paths').
    alias('browser', 'capabilities.browserName').
    alias('name', 'capabilities.name').
    alias('platform', 'capabilities.platform').
    alias('platform-version', 'capabilities.version').
    alias('tags', 'capabilities.tags').
    alias('build', 'capabilities.build').
    string('capabilities.tunnel-identifier');

var driver, browser;

var INITIAL_SUGGESTIONS = [
  'element(by.id(\'\'))',
  'element(by.css(\'\'))',
  'element(by.name(\'\'))',
  'element(by.binding(\'\'))',
  'element(by.xpath(\'\'))',
  'element(by.tagName(\'\'))',
  'element(by.className(\'\'))'
];

// WebDriver capabilities properties require dot notation, but optimist parses
// that into an object. Re-flatten it.
var flattenObject = function(obj) {
  var prefix = arguments[1] || '';
  var out = arguments[2] || {};
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        typeof obj[prop] === 'object' ?
            flattenObject(obj[prop], prefix + prop + '.', out) :
            out[prefix + prop] = obj[prop];
      }
    }
  return out;
};


var list = function(locator) {
  return browser.findElements(locator).then(function(arr) {
    var found = [];
    for (var i = 0; i < arr.length; ++i) {
      arr[i].getText().then(function(text) {
        found.push(text);
      });
    }
    return found;
  });
};

var flowEval = function(code, context, file, callback) {

  var vmErr,
      result,
      flow = webdriver.promise.controlFlow();

  flow.execute(function() {
    try {
      result = vm.runInThisContext(code, file);
    } catch (e) {
      vmErr = e;
      callback(vmErr, null);
    }
    if (vmErr && process.domain) {
      process.domain.emit('error', vmErr);
      process.domain.exit();
    }
    return result;
  }).then(function(res) {
    if (!vmErr) {
      callback(null, res);
    }
  }, function(err) {
    callback('There was a webdriver error: ' + err.name + ' ' + err.message,
        null);
  });
};

var startRepl = function() {
  var flowRepl = repl.start({
    'useGlobal': true,
    'eval': flowEval
  });

  var originalComplete = flowRepl.complete;

  flowRepl.complete = function(line, completeCallback) {
    if (line == '') {
      completeCallback(null, [INITIAL_SUGGESTIONS, '']);
    } else {
      originalComplete.apply(this, arguments);
    }
  };

  flowRepl.on('exit', function() {
    driver.quit();
    util.puts('Shutting down. Goodbye.');
  });
};

var startUp = function(config) {
  var runner = new Runner(config);
  driver = runner.driverprovider_.getDriver();

  driver.getSession().then(function(session) {
    driver.manage().timeouts().setScriptTimeout(11000);

    browser = protractor.wrapDriver(driver);

    // Set up globals to be available from the command line.
    global.driver = driver;
    global.protractor = protractor;
    global.browser = browser;
    global.$ = browser.$;
    global.$$ = browser.$$;
    global.element = browser.element;
    global.by = global.By = protractor.By;
    global.list = list;


    util.puts('Type <tab> to see a list of locator strategies.');
    util.puts('Use the `list` helper function to find elements by strategy:');
    util.puts('  e.g., list(by.binding(\'\')) gets all bindings.');
    util.puts('');

    var url = config.baseUrl || 'about:blank';
    util.puts('Getting page at: ' + url);
    driver.get(url);

    startRepl();
  });
};

var argv = optimist.argv;

if (argv.capabilities) {
  argv.capabilities = flattenObject(argv.capabilities);
}

var configParser = new ConfigParser();
if (argv.configFile) {
  configParser.addFileConfig(argv.configFile);
}
configParser.addConfig(argv);
var config = configParser.getConfig();

if (argv._[0]) {
  config.baseUrl = argv._[0];
}

if (argv.help || argv._.length > 1) {
  optimist.showHelp();
  process.exit(1);
}

startUp(config);
