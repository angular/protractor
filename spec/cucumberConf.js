var env = require('./environment.js');

// A small suite to make sure the cucumber framework works.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'cucumber',

  // Spec patterns are relative to this directory.
  specs: [
    'cucumber/*.feature'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  },

  cucumberOpts: {
    require: 'cucumber/stepDefinitions.js',
    tags: '@dev',
    format: 'summary'
  }
};
