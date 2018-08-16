var env = require('./environment');
var webdriver = require('selenium-webdriver');

var existingDriver = new webdriver.Builder()
  .usingServer(env.seleniumAddress)
  .withCapabilities(env.capabilities)
  .build();

exports.config = {

  framework: 'jasmine',

  specs: [
    'driverProviders/useExistingWebDriver/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  seleniumWebDriver: existingDriver,
};
