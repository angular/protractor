var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'baseCase/timeout_spec.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    defaultTimeoutInterval: 90000
  }

};
