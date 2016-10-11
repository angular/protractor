var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/synchronize_spec.js',
    'ng2/async_spec.js',
    'ng2/timeout_spec.js',
    'hybrid/async_spec.js'
  ],

  blockingProxyUrl: 'http://localhost:8111',

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
