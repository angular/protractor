var env = require('../environment.js');

// A small suite to make sure the full functionality of plugins work
exports.config = {
  mockSelenium: true,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/bigger_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

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
