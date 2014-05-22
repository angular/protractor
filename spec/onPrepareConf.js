var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
  
  onPrepare: function() {
    browser.params.password = '12345';
  }
};
