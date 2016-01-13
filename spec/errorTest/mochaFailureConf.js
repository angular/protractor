var env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  specs: [
    'baseCase/mocha_failure_spec.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  baseUrl: env.baseUrl + '/ng1/',

  mochaOpts: {
    reporter: 'spec',
    timeout: 4000
  },

  framework: 'mocha'
};
