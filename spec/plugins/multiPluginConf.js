var env = require('../environment.js');

// A small suite to make sure the full functionality of plugins work
exports.config = {
  mockSelenium: true,

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/bigger_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true
  },

  // Plugin patterns are relative to this directory.
  plugins: [{
    path: 'plugins/basic_plugin.js'
  }, {
    path: 'plugins/async_plugin.js'
  }, {
    inline: {
      setup: function() {
        protractor.__INLINE_PLUGIN_RAN = true;
      }
    }
  }]
};
