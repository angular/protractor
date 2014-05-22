var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'basic/lib_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  chromeOnly: false,

  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],

  baseUrl: env.baseUrl,

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
