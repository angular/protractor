// Configuration using a function in onPrepare to set a parameter before
// testing.
const env = require('./environment.js');

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

  onPrepare: () => {
    browser.params.password = '12345';
  }
};
