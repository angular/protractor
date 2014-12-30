var env = require('./environment.js');

// A configuration file running a simple direct connect spec
exports.config = {
  directConnect: true,

  framework: 'jasmine2',

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: env.baseUrl,

  specs: ['directConnect/*_spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
