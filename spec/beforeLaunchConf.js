
var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'basic/before_launch_spec.js'
  ],

  multiCapabilities: [{
    'browserName': 'chrome'
  }],

  beforeLaunch: function () {
    // Any object returned from beforeLaunch will be merged
    // with parsed configuration from this file.
    // E.g. a user may want to start up a development server
    // in beforeLaunch and dynamically configure `baseUrl`
    return new Promise((resolve) => {
      resolve({
        baseUrl:  env.baseUrl + '/ng1/'
      });
    });
  },

  params: {
    login: {
      user: 'Jane',
      password: '1234'
    }
  }
};
