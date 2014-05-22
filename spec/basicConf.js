var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'basic/*_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  chromeOnly: false,

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
