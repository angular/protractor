var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'custom',
  frameworkPath: './custom/framework.js',

  specs: [
    'custom/smoke_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/'
};
