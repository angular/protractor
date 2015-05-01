var env = require('../environment.js'),
    q = require('q');

// A small suite to make sure that the plugin hooks for waitForAngular work
exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/browser_get_wait_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    realtimeFailure: true
  },

  // Plugin patterns are relative to this directory.
  plugins: [{
    inline: {
      waitForPromise: function(oldURL) {
        return q.delay(5000).then(function() {
          protractor.WAIT_FOR_PROMISE = true;
        });
      },
      waitForCondition: function() {
        protractor.WAIT_FOR_CONDITION_COUNT =
            (protractor.WAIT_FOR_CONDITION_COUNT || 0) + 1;
        return protractor.WAIT_FOR_CONDITION_COUNT > 5;
      },
      teardown: function() {
        if (protractor.WAIT_FOR_PROMISE) {
          this.addSuccess();
        } else {
          this.addFailure('waitForPromise did not finish before teardown');
        }
        if (protractor.WAIT_FOR_CONDITION_COUNT > 5) {
          this.addSuccess();
        } else {
          this.addFailure('waitForCondition did not get called enough');
        }
      }
    }
  }]
};
