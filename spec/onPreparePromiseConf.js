// Configuration using a function in onPrepare to set a parameter before
// testing.
var env = require('./environment.js');
var q = require('q');

// The main suite of Protractor tests.
exports.config = {
  mockSelenium: true,

  framework: 'jasmine',

  specs: [
    'onPrepare/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onPrepare: function() {
    return q.fcall(function() {
      browser.params.password = '12345';
    }).delay(1000);
  }
};
