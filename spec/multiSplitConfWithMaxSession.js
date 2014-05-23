// A suite of tests to run on two browsers at once, splitting test files between
// the two instances of chrome.
var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'basic/mock*',
    'basic/lib_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  chromeOnly: false,

  maxSessions: 2,
  splitTestsBetweenCapabilities: true,
  multiCapabilities: [{
    'browserName': 'chrome',
    maxInstances: 1,
    specs: 'basic/polling*' // Capacity specific specs
  }, {
    'browserName': 'firefox',
    maxInstances: 2,
    specs: 'basic/action*'
  }],

  baseUrl: env.baseUrl,

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};

