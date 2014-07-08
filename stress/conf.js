// Configuration for stress testing.

// Before running locally, start up sauce connect and the test appliation.
// Then set the environment variables SAUCE_USERNAME, SAUCE_ACCESS_KEY,
// TRAVIS_JOB_NUMBER, and TRAVIS_BUILD_NUMBER.
exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  specs: [
    'spec.js'
  ],

  // Two latest versions of Chrome, Firefox, IE.
  multiCapabilities: [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '34',
    'selenium-version': '2.42.2',
    'platform': 'OS X 10.9'
  }, {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '35',
    'selenium-version': '2.42.2',
    'platform': 'OS X 10.9'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '29',
    'selenium-version': '2.42.2'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '30',
    'selenium-version': '2.42.2'
  }, {
    'browserName': 'internet explorer',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '11',
    'selenium-version': '2.42.2',
    'platform': 'Windows 7'
  }, {
    'browserName': 'internet explorer',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '10',
    'selenium-version': '2.42.2',
    'platform': 'Windows 7'
  }],

  baseUrl: 'http://localhost:8081',

  jasmineNodeOpts: {
    isVerbose: true,
    showTiming: true
  },
};
