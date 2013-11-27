// Tests for an Angular app where ng-app is not on the body.
exports.config = {
  seleniumServerJar: '../selenium/selenium-server-standalone-2.37.0.jar',
  chromeDriver: '../selenium/chromedriver',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this config.
  specs: [
    'altRoot/*_spec.js',
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  // Selector for the element housing the angular app.
  rootElement: 'div#nested-ng-app',

  baseUrl: 'http://localhost:8000',

  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: false,
    showColors: true,
    includeStackTrace: true,
  }
};
