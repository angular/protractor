var env = require('../environment.js');

module.exports = (framework) => {
  return {
    mockSelenium: true,
    SELENIUM_PROMISE_MANAGER: false,

    framework: framework,

    specs: [
      'specs/simple_spec.js'
    ],

    capabilities: env.capabilities,

    baseUrl: env.baseUrl + '/ng1/',

    plugins: [{
      path: 'plugins/post_test_plugin.js'
    }]
  };
};
