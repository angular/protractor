// The main suite of Protractor tests.
exports.config = {
  seleniumServerJar: '../selenium/selenium-server-standalone-2.35.0.jar',
  chromeDriver: '../selenium/chromedriver',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this directory.
  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000',
  
  onPrepare: function() {
    browser.params.password = '12345';
  }
};
