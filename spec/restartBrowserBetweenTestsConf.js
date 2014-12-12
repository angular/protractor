var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'restartBrowserBetweenTests/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true
  },

  restartBrowserBetweenTests: true,
};
