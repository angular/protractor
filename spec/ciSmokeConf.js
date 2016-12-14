var env = require('./environment.js');

// Smoke tests to be run on CI servers - covers more browsers than
// ciConf.js, but does not run all tests.
exports.config = {
  sauceUser: process.env.SAUCE_USERNAME,
  sauceKey: process.env.SAUCE_ACCESS_KEY,

  framework: 'jasmine',

  specs: [
    'basic/locators_spec.js',
    'basic/mockmodule_spec.js',
    'basic/synchronize_spec.js'
  ],

  // Two latest versions of IE, and Safari.
  // The second latest version of Chrome and Firefox (latest versions are
  // tested against the full suite in ciFullConf)
  // TODO - add mobile.
  multiCapabilities: [{
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '54',
    'selenium-version': '3.0.1',
    'chromedriver-version': '2.26',
    'platform': 'OS X 10.9'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '50',
    'selenium-version': '3.0.1'
  }, {
    'browserName': 'safari',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '10',
    'selenium-version': '3.0.1'
  }, {
    'browserName': 'microsoftedge',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '14',
    'selenium-version': '3.0.1',
    'platform': 'Windows 10'
  }, {
    'browserName': 'internet explorer',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '11',
    'selenium-version': '3.0.1',
    'platform': 'Windows 8'
  }],

  baseUrl: env.baseUrl + '/ng1/',

  // Up the timeouts for the slower browsers (IE, Safari).
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
