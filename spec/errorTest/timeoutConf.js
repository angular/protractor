var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

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
  },

};
