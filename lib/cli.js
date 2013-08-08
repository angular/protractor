var util = require('util');
var path = require('path')
var fs = require('fs');
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var minijn = require('minijasminenode');
var protractor = require('./protractor.js');
var SauceLabs = require('saucelabs');
var glob = require('glob');

var args = process.argv.slice(2);

// Default configuration.
var config = {
  seleniumServerJar: null,
  seleniumArgs: [],
  seleniumPort: null,
  seleniumAddress: null,
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    specs: [],
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
}

var originalOnComplete = config.jasmineNodeOpts.onComplete;

var server;
var driver;
var id;

var cleanUp = function(runner, log) {
  var passed = runner.results().failedCount == 0;
  if (originalOnComplete) {
    originalOnComplete(runner, log);
  }
  if (sauceAccount) {
    sauceAccount.updateJob(id, {'passed': passed}, function() {});
    process.exit(passed? 0 : 1);
  }

  driver.quit().then(function() {
    if (server) {
      util.puts('Shutting down selenium standalone server');
      server.stop();
    }
  }).then(function() {
    process.exit(passed? 0 : 1);
  });
};

var printVersion = function () {
  util.puts('Version ' + JSON.parse(
      fs.readFileSync(__dirname + '/../package.json', 'utf8')).version);
  process.exit(0);
};

var run = function() {
  if (config.jasmineNodeOpts.specFolders) {
    throw new Error('Using config.jasmineNodeOpts.specFolders is deprecated ' +
        'in Protractor 0.6.0. Please switch to config.specs.');
  }
  var specs = config.specs;
  var resolvedSpecs = [];
  for (var i = 0; i < specs.length; ++i) {
    var matches = glob.sync(specs[i]);
    if (!matches.length) {
      throw new Error('Test file ' + specs[i] + ' did not match any files.');
    }
    for (var j = 0; j < matches.length; ++j) {
      resolvedSpecs.push(matches[j]);
    }
  }
  minijn.addSpecs(resolvedSpecs);

  if (config.sauceUser && config.sauceKey) {
    config.capabilities.username = config.sauceUser;
    config.capabilities.accessKey = config.sauceKey;
    config.seleniumAddress = 'http://' + config.sauceUser + ':' +
        config.sauceKey + '@ondemand.saucelabs.com:80/wd/hub';

    util.puts('Using SauceLabs selenium server at ' + config.seleniumAddress);
    startJasmineTests();
  } else if (config.seleniumAddress) {

    util.puts('Using the selenium server at ' + config.seleniumAddress);
    startJasmineTests();
  } else if (config.seleniumServerJar) {
    util.puts('Starting selenium standalone server...');
    if (config.chromeDriver) {
      if (!fs.existsSync(config.chromeDriver)) {
        if (fs.existsSync(config.chromeDriver + '.exe')) {
          config.chromeDriver += '.exe';
        } else {
          throw 'Could not find chromedriver at ' + config.chromeDriver;
        }
      }
      config.seleniumArgs.push(
          '-Dwebdriver.chrome.driver=' + config.chromeDriver);
    }
    server = new remote.SeleniumServer(config.seleniumServerJar, {
      args: config.seleniumArgs,
      port: config.seleniumPort
    });
    server.start().then(function(url) {

      util.puts('Selenium standalone server started at ' + url);
      config.seleniumAddress = server.address();
      startJasmineTests();
    });
  } else {
    throw new Error('You must specify either a seleniumAddress, ' +
        'seleniumServerJar, or saucelabs account.');
  }
}

var startJasmineTests = function() {
  driver = new webdriver.Builder().
      usingServer(config.seleniumAddress).
      withCapabilities(config.capabilities).build();

  driver.manage().timeouts().setScriptTimeout(100000);
  driver.getSession().then(function(session) {
    id = session.id;
  });

  protractor.setInstance(protractor.wrapDriver(driver, config.baseUrl));

  // Export protractor to the global namespace to be used in tests.
  global.protractor = protractor;

  // Set up the Jasmine WebDriver Adapter
  require('../jasminewd');

  var options = config.jasmineNodeOpts;
  options.onComplete = cleanUp;

  minijn.executeSpecs(options);
}

if (!args.length) {
  util.puts('USAGE: protractor configFile [options]');
  util.puts('Options:');
  util.puts('  --version: Print Protractor version');
  util.puts('  --seleniumAddress: A running selenium address to use');
  util.puts('  --seleniumServerJar: Location of the standalone selenium server .jar file');
  util.puts('  --seleniumPort: Optional port for the standalone selenium server');

  process.exit(0);
}

while(args.length) {
  var arg = args.shift();
  switch(arg) {
    case '--version':
      printVersion();
      break;
    case '--browser':
      config.capabilities.browserName = args.shift();
      break;
    case '--seleniumAddress':
      config.seleniumAddress = args.shift();
      break;
    case '--seleniumServerJar':
      config.seleniumServerJar = args.shift();
      break;
    case '--seleniumPort':
      config.seleniumPort = args.shift();
      break;
    default:
      config = require(path.resolve(process.cwd(), arg)).config;
      break;
  }
}

var sauceAccount;
if (config.sauceUser && config.sauceKey) {
  sauceAccount = new SauceLabs({
    username: config.sauceUser,
    password: config.sauceKey
  });
}

run();
