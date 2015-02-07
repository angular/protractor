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

  framework: 'debugprint',
  maxSessions: 3,
  multiCapabilities: [{
    'browserName': 'chrome',
    maxInstances: 2
  }, {
    'browserName': 'chrome',
    shardTestFiles: true,
    maxInstances: 1,
    specs: 'basic/polling*' // Capacity specific specs
  }, {
    shardTestFiles: true,
    'browserName': 'firefox',
    maxInstances: 2,
    count: 2,
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

