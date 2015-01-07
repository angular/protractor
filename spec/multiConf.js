// A suite of tests to run on two browsers at once.
var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/lib_spec.js'
  ],

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
