var env = require('./environment.js');

// A configuration file running a simple direct connect spec
exports.config = {
  directConnect: true,

  framework: 'jasmine',

  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox'
  }],

  baseUrl: env.baseUrl + '/ng1/',

  specs: ['directConnect/*_spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
