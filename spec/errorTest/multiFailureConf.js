var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'baseCase/single_failure_spec1.js',
    'baseCase/single_failure_spec2.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000
  }

};
