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
    'version': '48',
    'selenium-version': '2.52.0',
    'chromedriver-version': '2.21',
    'platform': 'OS X 10.9'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor suite tests',
    'version': '44',
    'selenium-version': '2.52.0'
  }],

  baseUrl: env.baseUrl + '/ng1/',

  jasmineNodeOpts: {
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
