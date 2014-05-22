// Configuration using a function in onPrepare to set a parameter before
// testing.
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8000'),
  
  onPrepare: function() {
    browser.params.password = '12345';
  }
};
