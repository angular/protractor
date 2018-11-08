// Configuration using a function in onPrepare to set a parameter before
// testing.
const env = require('./environment.js');
var q = require('q');

// The main suite of Protractor tests.
exports.config = {
  mockSelenium: true,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onPrepare: async() => {
    browser.params.password = '12345';
    return await new Promise(resolve => {
      setTimeout(resolve, 1000);
    });
  }
};
