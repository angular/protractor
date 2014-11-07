var env = require('../environment.js');

// The main suite of Protractor tests to be run on CI servers.
exports.config = {
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
  },

};
