// Configuration using a string in onPrepare to load a file with code to
// execute once before tests.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Spec patterns are relative to this directory.
  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000',
  
  onPrepare: 'onPrepare/startup.js'
};
