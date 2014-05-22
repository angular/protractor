// A small suite to make sure the cucumber framework works.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  framework: 'cucumber',

  // Spec patterns are relative to this directory.
  specs: [
    'cucumber/*.feature'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8000'),

  cucumberOpts: {
    require: 'cucumber/stepDefinitions.js',
    tags: '@dev',
    format: 'summary'
  }
};
