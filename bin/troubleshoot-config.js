#!/usr/bin/env node

/**
 * This is a standalone runner to try determine where an error in startup
 * is occuring. It accepts one argument, a configuration file.
 */
var ConfigParser = require('../lib/configParser');
var helper = require('../lib/util.js');
var q = require('q');
var webdriver = require('selenium-webdriver');

var configFile = process.argv[2];

if (!configFile) {
  console.log('troubleshoot-config diagnoses issues with Protractor configuration files');
  console.log('Usage: troubleshoot-config <config>');
  process.exit();
}

console.log('Running troubleshoot-config');
console.log('Protractor version: ' + require('../package.json').version);

var config;
try {
  console.log('Parsing configuration file...');
  var configParser = new ConfigParser();
  configParser.addFileConfig(configFile);
  config = configParser.getConfig();
} catch (e) {
  console.log('FAIL - Your configuration file could not be parsed. Error: ');
  throw (e);
}

if (config.capabilities) {
  if (config.multiCapabilities.length) {
    console.log('WARNING - You have specified both capabilites and multiCapabilities');
    console.log('  This will result in capabilities being ignored.');
  } else {
    config.multiCapabilities = [config.capabilities];
  }
}

if (config.multiCapabilities.length > 1) {
  console.log('You have specified ' + config.multiCapabilities.length + ' browser configurations.');
  console.log('  WARNING - The troubleshooter will test against the first.');
}

config.capabilities = config.multiCapabilities[0];
console.log('Will use the capabilities: ');
console.dir(config.capabilities);

try {
  console.log('Loading Driver Provider...');
  var driverProvider = helper.getDriverProvider(config);
} catch (e) {
  console.log('FAIL - A Driver Provider could not be loaded. Error:');
  throw(e);
}

console.log('Setting up the Driver Provider...');
try {
  driverProvider.setupEnv().then(function() {
    console.log('Getting an instance of WebDriver and starting a session...');
    var driver = driverProvider.getDriver();
    driver.getSession().then(function(session) {
      if (config.baseUrl) {
        console.log('Your base URL for tests is ' + baseUrl);
      }

      console.log('Closing Driver...');
      driverProvider.teardownEnv().then(function() {
        console.log('PASS - configuration working');
      });

    }, function(e) {
      console.log('FAIL - Your Driver was unable to start a session.');
      throw (e);
    });
  }, function(e) {
    console.log('FAIL - Unable to set up the Driver Provider. Error:');
    throw(e);
  });
} catch (e) {
  console.log('FAIL - Unable to set up the Driver Provider. Error:');
  throw(e);
}
