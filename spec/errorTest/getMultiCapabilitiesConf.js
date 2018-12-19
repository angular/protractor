const env = require('../environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  // Spec patterns are relative to this directory.
  specs: [
    '../../basic/mock*'
  ],

  getMultiCapabilities: function() {
    return new Promise(() => {
      throw new Error('get multi capabilities failed');
    });
  },

  baseUrl: env.baseUrl + '/ng1/'
};
