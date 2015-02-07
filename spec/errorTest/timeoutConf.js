var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  specs: [
    'baseCase/timeout_spec.js'
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
