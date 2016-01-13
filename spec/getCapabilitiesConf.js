var env = require('./environment.js');
var q = require('q');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  // Spec patterns are relative to this directory.
  specs: [
    'basic/mock*'
  ],

  framework: 'debugprint',
  getMultiCapabilities: function() {
    var deferred = q.defer();
    // Wait for a server to be ready or get capabilities asynchronously.
    setTimeout(function() {
      deferred.resolve([{
        'browserName': 'firefox'
      }]);
    }, 1000);
    return deferred.promise;
  },

  baseUrl: env.baseUrl + '/ng1/'
};

