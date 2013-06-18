var util = require('util');
var path = require('path')
var webdriver = require('selenium-webdriver');
var remote = require('selenium-webdriver/remote');
var jasmine = require('jasmine-node');
var protractor = require('./protractor.js');

var args = process.argv.slice(2);

// Default configuration.
var config = {
  seleniumServerJar: null,
  seleniumPort: null,
  seleniumAddress: null,
  capabilities: {
    'browserName': 'chrome'
  },
  jasmineNodeOpts: {
    specFolders: [],
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
}

var originalOnConfig = config.jasmineNodeOpts.onConfig;

var server;
var driver;

var cleanUp = function(runner, log) {
  if (originalOnConfig) {
    originalOnConfig(runner, log);
  }
  util.print('\n');
  if (runner.results().failedCount == 0) {
    exitCode = 0;
  } else {
    exitCode = 1;
  }
  driver.quit();
  if (server) {
    util.puts('Shutting down selenium standalone server');
    server.stop();
  }
};

var printVersion = function () {
  util.puts('Version 0.2.1');
  process.exit(0);
};

var run = function() {
  // Check the spec folders.
  var specs = config.jasmineNodeOpts.specFolders;
  for (var i = 0; i < specs.length; ++i) {
    specs[i] = path.resolve(process.cwd(), specs[i]);
    if(!path.existsSync(specs[i])) {
      throw new Error('Test folder/file ' + specs[i] + ' not found.');
    }
  }

  if (config.seleniumAddress) {
    driver = new webdriver.Builder().
      usingServer(config.seleniumAddress).
      withCapabilities(config.capabilities).build();
      startJasmineTests();
  } else {
    util.puts('Starting selenium standalone server...');
    server = new remote.SeleniumServer({
      jar: config.seleniumServerJar,
      port: config.seleniumPort
    });
    server.start().then(function(url) {
      util.puts('Selenium standalone server started at ' + url);
      driver = new webdriver.Builder().
      usingServer(server.address()).
      withCapabilities(config.capabilities).build();
      startJasmineTests();
    });
  }
}

var startJasmineTests = function() {
  driver.manage().timeouts().setScriptTimeout(100000);
  process.protractorInstance = protractor.wrapDriver(driver);

  var options = config.jasmineNodeOpts;
  options.onComplete = cleanUp;

  jasmine.executeSpecsInFolder(options);
}

if (!args.length) {
  util.puts('USAGE: protractor configFile [options]');
  util.puts('Options:');
  util.puts('  --version: Print Protractor version');
  util.puts('  --seleniumAddress: A running selenium address to use.');
  util.puts('  --seleniumServerJar: Location of the standalone selenium server .jar file');
  
  process.exit(0);
}

while(args.length) {
  var arg = args.shift();
  switch(arg) {
    case '--version':
      printVersion();
      break;
    case '--browser':
      config.capabilities.browserName = args.shift().split(',');
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

run();
