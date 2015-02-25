var env = require('../environment.js');

// A small suite to make sure the full functionality of plugins work
exports.config = {
  // seleniumAddress: env.seleniumAddress,
  mockSelenium: true,

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    '../plugins/fail_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true
  },

  // Plugin patterns are relative to this directory.
  plugins: [{
    path: '../plugins/basic_plugin.js'
  }, {
    path: '../plugins/failing_plugin.js'
  }]
};
