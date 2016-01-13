var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  browserstackUser: process.env.BROWSER_STACK_USERNAME,
  browserstackKey: process.env.BROWSER_STACK_ACCESS_KEY,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/*_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true
  },

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
exports.config.capabilities['browserstack.local'] = true;
