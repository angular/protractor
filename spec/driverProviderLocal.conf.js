var env = require('./environment');

exports.config = {

  framework: 'jasmine',
  SELENIUM_PROMISE_MANAGER: false,

  specs: [
    'driverProviders/local/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl,
};
