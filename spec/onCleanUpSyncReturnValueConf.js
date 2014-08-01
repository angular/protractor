var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onCleanUp: function(exitCode) {
    return exitCode;
  }
};
