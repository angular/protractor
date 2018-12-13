var env = require('./environment');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  SELENIUM_PROMISE_MANAGER: false,

  framework: 'jasmine',

  specs: [
    'driverProviders/attachSession/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
};
