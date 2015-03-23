var env = require('./environment.js');

// Test that onCleanUp actions are performed.
exports.config = {
  mockSelenium: true,

  framework: 'jasmine2',

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onCleanUp: function(exitCode) {
    // no return
  }
};
