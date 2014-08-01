var env = require('./environment.js');
var q = require('q');

// The main suite of Protractor tests.
exports.config = {
  seleniumAddress: env.seleniumAddress,

  specs: [
    'onCleanUp/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,

  onCleanUp: function(exitCode) {
    var deferred = q.defer();
    setTimeout(function () {
      deferred.resolve(exitCode);
    }, 500);
    return deferred.promise;
  }
};
