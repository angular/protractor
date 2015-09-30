var env = require('./environment.js');

// The main suite of Protractor tests to be run on CI servers.
exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine2',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/*_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor suite tests',
    'version': '45',
    'selenium-version': '2.47.1',
    'chromedriver-version': '2.19',
    'platform': 'OS X 10.9'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor suite tests',
    'version': '40',
    'selenium-version': '2.47.1'
  }],

  baseUrl: env.baseUrl,

  jasmineNodeOpts: {
    isVerbose: true,
    showTiming: true,
    defaultTimeoutInterval: 90000
  },

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
