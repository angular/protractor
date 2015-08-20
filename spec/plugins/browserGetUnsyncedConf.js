var env = require('../environment.js'),
    q = require('q');

// Make sure that borwser-related plugin hooks work with browser sync off
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
      setup: function() {
        browser.ignoreSynchronization = true;
      },
      onPageLoad: function() {
        return q.delay(5000).then(function() {
          protractor.ON_PAGE_LOAD = true;
        });
      },
      onPageStable: function() {
        this.addFailure('onPageStable should not have ran when ' +
            'browser.ignoreSynchronization is true.');
      },
      teardown: function() {
        if (protractor.ON_PAGE_LOAD) {
          this.addSuccess();
        } else {
          this.addFailure('onPageLoad did not finish before teardown');
        }
      }
    }
  }]
};
