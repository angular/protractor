var env = require('./environment.js');

// This is the configuration file showing how a suite of tests might
// handle log-in using the onPrepare field.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'login/login_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onPrepare: function() {
    browser.driver.get(env.baseUrl + '/ng1/login.html');

    browser.driver.findElement(by.id('username')).sendKeys('Jane');
    browser.driver.findElement(by.id('password')).sendKeys('1234');
    browser.driver.findElement(by.id('clickme')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    return browser.driver.wait(function() {
      return browser.driver.getCurrentUrl().then(function(url) {
        return /index/.test(url);
      });
    }, 10000);
  }
};
