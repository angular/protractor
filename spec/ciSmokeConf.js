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
    'selenium-version': '2.53.1',
    'chromedriver-version': '2.26',
    'platform': 'OS X 10.11'
  }, {
    'browserName': 'firefox',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '47',
    'selenium-version': '2.53.1'
  }, {
    // TODO: Add Safari 10 once Saucelabs gets Selenium 3
    'browserName': 'safari',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '9',
    'selenium-version': '2.44.0' // Use an old version because Safari has
                                 // issues loading pages after 2.44.
  }, {
    'browserName': 'MicrosoftEdge',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '14.14393',
    'selenium-version': '2.53.1',
    'platform': 'Windows 10'
  }, {
    'browserName': 'Internet Explorer',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'name': 'Protractor smoke tests',
    'version': '11',
    'selenium-version': '2.53.1',
    'platform': 'Windows 8.1'
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
