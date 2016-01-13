var env = require('./environment.js');

// A small suite to make sure the mocha frameowork works.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'mocha',

  // Spec patterns are relative to this directory.
  specs: [
    'mocha/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  mochaOpts: {
    reporter: 'spec',
    timeout: 4000
  }
};
