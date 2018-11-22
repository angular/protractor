var env = require('./environment.js');

// A configuration file running a simple direct connect spec
exports.config = {
  directConnect: true,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  // Disabled until https://github.com/angular/protractor/issues/4253 is resolved
  /*
  multiCapabilities: [{
    'browserName': 'chrome'
  }, {
    'browserName': 'firefox',
  }],
  */
  capabilities: {
    browserName: 'chrome',
  },

  baseUrl: env.baseUrl + '/ng1/',

  specs: ['directConnect/*_spec.js'],

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  }
};
