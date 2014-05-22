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

  baseUrl: env.baseUrl,

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
