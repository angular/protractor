var env = require('./environment.js');
var webdriver = require('selenium-webdriver');

// Tests for cases that have caused WebDriver promise locks in
// the past.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'control/spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onPrepare: function() {

    // This is a reasonable use case - do some promise that takes some time,
    // and then do a wait until something is set up correctly.
    return webdriver.promise.delayed(100).then(function() {
      // This could also be replaced by an 'execute' to see the same behavior.
      return browser.driver.wait(function() {
        return true;
      }, 10000, 'onPrepare wait');
    });
  }
};
