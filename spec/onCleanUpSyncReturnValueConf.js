var env = require('./environment.js');

// Test that onCleanUp actions are performed.
exports.config = {
  mockSelenium: true,

  framework: 'jasmine',

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onCleanUp: function(exitCode) {
    return exitCode;
  }
};
