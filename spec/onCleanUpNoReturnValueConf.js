var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onCleanUp: function(exitCode) {
    // no return
  }
};
