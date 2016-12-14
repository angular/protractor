var env = require('./environment.js');

// The main suite of Protractor tests to be run on CI servers.
exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

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
    'version': '55',
    'selenium-version': '3.0.1',
    'chromedriver-version': '2.25',
    'platform': 'OS X 10.9'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor suite tests',
    'version': '50',
    'selenium-version': '3.0.1'
  }],

  baseUrl: env.baseUrl + '/ng1/',

  allScriptsTimeout: 120000,
  getPageTimeout: 120000,

  jasmineNodeOpts: {
    showTiming: true,
    defaultTimeoutInterval: 120000
  },

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
