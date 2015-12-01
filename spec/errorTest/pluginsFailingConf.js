var env = require('../environment.js');

// A small suite to make sure the full functionality of plugins work
exports.config = {
  // seleniumAddress: env.seleniumAddress,
  mockSelenium: true,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    '../plugins/specs/fail_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  // Plugin patterns are relative to this directory.
  plugins: [{
    path: '../plugins/plugins/basic_plugin.js'
  }, {
    path: '../plugins/plugins/failing_plugin.js'
  }]
};
