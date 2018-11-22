var env = require('./environment');

// This is the configuration for a smoke test for an Angular TypeScript application.
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'ng2/async_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
  allScriptsTimeout: 120000,
  getPageTimeout: 120000,
  jasmineNodeOpts: {
    defaultTimeoutInterval: 120000
  }
};
