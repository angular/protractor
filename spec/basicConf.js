// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

    // Spec patterns are relative to this directory.
  specs: [
    'basic/*_spec.js',
    'basic/*_test.js'
  ],

  // Exclude patterns are relative to this directory.
  excludes: [
    'basic/excludeme_*.js'
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
