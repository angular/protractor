var env = require('./environment.js');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/lib_spec.js',
    'basic/locators_spec.js'
    // 'basic/elements_spec.js',
    // 'basic/navigation_spec.js',
    // 'basic/handling_spec.js',
  ],

  // Exclude patterns are relative to this directory.
  // exclude: [
  //   'basic/exclude*.js'
  // ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
