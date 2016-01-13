var env = require('./environment.js');
var q = require('q');

// Test that onCleanUp actions are performed.
exports.config = {
  mockSelenium: true,

  framework: 'jasmine',

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  onCleanUp: function(exitCode) {
    var deferred = q.defer();
    setTimeout(function() {
      deferred.resolve(exitCode);
    }, 500);
    return deferred.promise;
  }
};
