const env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'baseCase/single_failure_spec1.js',
    'baseCase/single_failure_spec2.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome',
    maxInstances: 2,
    shardTestFiles: true
  }],

  baseUrl: env.baseUrl + '/ng1/',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000
  }

};
