var env = require('../environment.js');

// A small suite to make sure the basic functionality of plugins work
// Tests the (potential) edge case of exactly one plugin being used
exports.config = {
  mockSelenium: true,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/smoke_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  // Plugin patterns are relative to this directory.
  plugins: [{
    path: 'plugins/basic_plugin.js'
  }]
};
