var env = require('../../../spec/environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  framework: 'jasmine2',
  specs: ['success_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    chromeA11YDevTools: true,
    path: "../index.js"
  }]
};
