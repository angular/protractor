// A suite of tests to run on two browsers at once, splitting test files between
// the two instances of chrome.
var env = require('./environment.js');

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

  splitTestsBetweenCapabilities: true,
  multiCapabilities: [{
    'browserName': 'chrome',
    count: 2
  }],

  baseUrl: env.baseUrl,

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};

