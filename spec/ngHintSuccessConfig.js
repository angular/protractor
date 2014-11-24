var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,
  specs: ['ngHint/success_spec.js'],
  baseUrl: env.baseUrl,
  plugins: [{
    path: "../plugins/ngHintPlugin.js"
  }]
};
