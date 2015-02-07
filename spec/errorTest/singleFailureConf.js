var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  specs: [
    'baseCase/single_failure_spec1.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    showTiming: true,
    defaultTimeoutInterval: 90000
  }

};
