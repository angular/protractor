var env = require('./environment.js');

// Configuration using a string in onPrepare to load a file with code to
// execute once before tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
  
  onPrepare: 'onPrepare/startup.js'
};
