var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'restartBrowserBetweenTests/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  restartBrowserBetweenTests: true
};
