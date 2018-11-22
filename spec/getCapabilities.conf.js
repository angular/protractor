const env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  // Spec patterns are relative to this directory.
  specs: [
    'basic/mock*'
  ],

  framework: 'debugprint',
  getMultiCapabilities: async function() {
    // Wait for a server to be ready or get capabilities asynchronously.
    return await new Promise(resolve => {
      setTimeout(() => {
        resolve([{
          'browserName': 'firefox'
        }]);
      }, 1000);
    });
  },

  baseUrl: env.baseUrl + '/ng1/'
};

