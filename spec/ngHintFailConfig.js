var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  specs: ['ngHint/fail_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    path: "../plugins/ngHintPlugin.js"
  }]
};
