// A suite of tests to run on two browsers at once, splitting test files between
// the two instances of chrome.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this directory.
  specs: [
    'basic/*_spec.js'
  ],

  // Exclude patterns are relative to this directory.
  exclude: [
    'basic/exclude*.js'
  ],

  chromeOnly: false,

  splitTestsBetweenCapabilities: true,
  multiCapabilities: [{
    'browserName': 'chrome',
    count: 2
  }],

  baseUrl: 'http://localhost:8000',

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};

