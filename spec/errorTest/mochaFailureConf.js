var env = require('../environment.js');

// A small suite to make sure the mocha framework works.
exports.config = {
  specs: [
    'baseCase/mocha_failure_spec.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  baseUrl: env.baseUrl,

  mochaOpts: {
    reporter: 'spec',
    timeout: 4000
  },

  framework: 'mocha',
};
