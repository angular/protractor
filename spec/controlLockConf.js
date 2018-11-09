const env = require('./environment.js');
const webdriver = require('selenium-webdriver');

// Tests for cases that have caused WebDriver promise locks in
// the past.
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'control/spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onPrepare: async function() {
    // This is a reasonable use case - do some promise that takes some time,
    // and then do a wait until something is set up correctly.
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    // This could also be replaced by an 'execute' to see the same behavior.
    return await browser.driver.wait(function() {
      return true;
    }, 10000, 'onPrepare wait');
  }
};
