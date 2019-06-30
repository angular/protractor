const env = require('./environment');

// This is the configuration for a smoke test for an Angular2 application.
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'noGlobals/noGlobals_spec.js'
  ],

  noGlobals: true,

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
};
