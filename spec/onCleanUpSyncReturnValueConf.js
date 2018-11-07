const env = require('./environment.js');

// Test that onCleanUp actions are performed.
exports.config = {
  mockSelenium: true,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onCleanUp: (exitCode) => {
    return exitCode;
  }
};
