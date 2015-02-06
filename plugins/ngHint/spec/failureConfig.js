var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  framework: 'jasmine2',
  specs: ['fail_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    path: "../index.js"
  }]
};
