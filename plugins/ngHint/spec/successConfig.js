var env = require('../../../spec/environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  framework: 'jasmine',
  specs: ['success_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    path: '../index.js'
  }]
};
