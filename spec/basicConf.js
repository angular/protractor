// The main suite of Protractor tests.
exports.config = {
  seleniumServerJar: '../selenium/selenium-server-standalone-2.37.0.jar',
  chromeDriver: '../selenium/chromedriver',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000',

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
