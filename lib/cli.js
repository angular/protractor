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
var configDir, configPath;

var merge = function(into, from) {
  for (key in from) {
    if (into[key] instanceof Object) {
      merge(into[key], from[key]);
    } else {
      into[key] = from[key];
    }
  }
};

// Default configuration.
var config = {
  seleniumServerJar: null,
  seleniumArgs: [],
  seleniumPort: null,
  seleniumAddress: null,
  capabilities: {
    'browserName': 'chrome'
  },
  rootElement: 'body',
  jasmineNodeOpts: {
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
}

var originalOnComplete;
var server;
var driver;
var id;

var cleanUp = function(runner, log) {
  if (originalOnComplete) {
    originalOnComplete(runner, log);
  }

  var passed = runner.results().failedCount == 0;
  var exitCode = passed ? 0 : 1;

  driver.quit().then(function() {
    if (sauceAccount) {
      sauceAccount.updateJob(id, {'passed': passed}, function(err) {
        if (err) {
          throw new Error(
            "Error updating Sauce pass/fail status: " + util.inspect(err)
          );
        }
        process.exit(exitCode);
      });
    } else if (server) {
      util.puts('Shutting down selenium standalone server');
      server.stop().then(function() {
        process.exit(exitCode);
      });
    } else {
      process.exit(exitCode);
    }
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
    var matches = glob.sync(specs[i], {cwd: configDir});
    if (!matches.length) {
      throw new Error('Test file ' + specs[i] + ' did not match any files.');
    }
    for (var j = 0; j < matches.length; ++j) {
      resolvedSpecs.push(path.resolve(configDir, matches[j]));
    }
  }
  minijn.addSpecs(resolvedSpecs);

  if (config.sauceUser && config.sauceKey) {
    config.capabilities.username = config.sauceUser;
    config.capabilities.accessKey = config.sauceKey;
    if (!config.jasmineNodeOpts.defaultTimeoutInterval) {
      config.jasmineNodeOpts.defaultTimeoutInterval = 30 * 1000;
    }
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

  driver.getSession().then(function(session) {
    driver.manage().timeouts().setScriptTimeout(11000);

    id = session.getId();

    protractor.setInstance(protractor.wrapDriver(driver, config.baseUrl, config.rootElement));

    // Export protractor to the global namespace to be used in tests.
    global.protractor = protractor;

    // Set up the Jasmine WebDriver Adapter.
    require('../jasminewd');

    var options = config.jasmineNodeOpts;
    originalOnComplete = options.onComplete;
    options.onComplete = cleanUp;

    // Let the configuration configure the protractor instance before running
    // the tests.
    webdriver.promise.controlFlow().execute(function() {
      if (config.onPrepare) {
        if (typeof config.onPrepare == 'function') {
          config.onPrepare();
        } else if (typeof config.onPrepare == 'string') {
          require(path.resolve(process.cwd(), config.onPrepare));
        } else {
          throw 'config.onPrepare must be a string or function';
        }
      }
    }).then(function() {
      minijn.executeSpecs(options);
    });
  });
}

if (!args.length) {
  util.puts('USAGE: protractor configFile [options]');
  util.puts('Options:');
  util.puts('  --version: Print Protractor version');
  util.puts('  --seleniumAddress <string>: A running selenium address to use');
  util.puts('  --seleniumServerJar <string>: Location of the standalone selenium server .jar file');
  util.puts('  --seleniumPort <string>: Optional port for the standalone selenium server');
  util.puts('  --baseUrl <string>: URL to prepend to all relative paths');
  util.puts('  --rootElement <string>: Element housing ng-app, if not html or body');
  util.puts('  --specs <list>: Comma separated list of files to test');
  util.puts('  --[no]includeStackTrace: Print stack trace on error');
  util.puts('  --verbose: Print full spec names');

  process.exit(0);
}

var commandLineConfig = { capabilities: {}, jasmineNodeOpts: {}};

while(args.length) {
  var arg = args.shift();
  switch(arg) {
    case '--version':
      printVersion();
      break;
    case '--browser':
      commandLineConfig.capabilities.browserName = args.shift();
      break;
    case '--seleniumAddress':
      commandLineConfig.seleniumAddress = args.shift();
      break;
    case '--seleniumServerJar':
      commandLineConfig.seleniumServerJar = args.shift();
      break;
    case '--seleniumPort':
      commandLineConfig.seleniumPort = args.shift();
      break;
    case '--sauceUser':
      commandLineConfig.sauceUser = args.shift();
      break;
    case '--sauceKey':
      commandLineConfig.sauceKey = args.shift();
      break;
    case '--baseUrl':
      commandLineConfig.baseUrl = args.shift();
      break;
    case '--rootElement':
      commandLineConfig.rootElement = args.shift();
      break;
    case '--specs':
      commandLineSpecs = args.shift().split(',');
      commandLineSpecs.forEach(function(spec, index, arr) {
        arr[index] = path.resolve(process.cwd(), spec);
      });
      commandLineConfig.specs = commandLineSpecs;
      break;
    case '--includeStackTrace':
      commandLineConfig.jasmineNodeOpts.includeStackTrace = true;
      break;
    case '--noincludeStackTrace':
      commandLineConfig.jasmineNodeOpts.includeStackTrace = false;
      break;
    case '--verbose':
      commandLineConfig.jasmineNodeOpts.isVerbose = true;
      break;
    default:
      configPath = path.resolve(process.cwd(), arg);
      configDir = path.dirname(configPath);
      break;
  }
}

merge(config, require(configPath).config);
merge(config, commandLineConfig);

var sauceAccount;
if (config.sauceUser && config.sauceKey) {
  sauceAccount = new SauceLabs({
    username: config.sauceUser,
    password: config.sauceKey
  });
}

run();
