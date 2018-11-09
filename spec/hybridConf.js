const env = require('./environment');

// This is the configuration for a smoke test for a hybrid ng1/ng2 application.
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'hybrid/async_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl
};
