// A suite of tests to run on max of two browsers instances at once, splitting test suites between
// the two instances of chrome.
var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  suites: {
    okspec: 'spec/suites/ok_spec.js',
    okstepmodule: ['spec/suites/ok_step_1_spec.js', 'spec/suites/ok_step_2_spec.js']
  },

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  framework: 'jasmine',
  maxSessions: 2,
  multiCapabilities: [{
    'browserName': 'chrome',
    shardTestSuites: true,
    maxInstances: 2
  }],

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    showTiming: true,
    defaultTimeoutInterval: 90000
  }
};

