var env = require('../environment.js');

// Verifies that plugins can change skipAngularStability on the fly.
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/skip_stability_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  // Define a plugin that allows skipAngularStability to be changed.
  plugins: [{
    inline: {
      setup: function() {
        this.skipAngularStability = false;
        var plugin = this;

        protractor._PluginSetSkipStability = function(newValue) {
          plugin.skipAngularStability = newValue;
        };
      }
    }
  }]
};
