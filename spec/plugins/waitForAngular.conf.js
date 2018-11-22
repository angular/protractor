var env = require('../environment.js');

// A small suite to make sure that the plugin hooks for waitForAngular work
exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  // Spec patterns are relative to this directory.
  specs: [
    'specs/browser_get_wait_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  // Plugin patterns are relative to this directory.
  plugins: [{
    inline: {
      waitForPromise: async function() {
        return await new Promise(resolve => {
          setTimeout(() => {
            protractor.WAIT_FOR_PROMISE = true;
            resolve();
          }, 5000);
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
