var env = require('../spec/environment.js');

// Examples of tests to show how timeouts works with Protractor. Tests
// should be run against the testapp.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: [
    'timeout_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  // ----- Options to be passed to minijasminenode.
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true
  }
};
