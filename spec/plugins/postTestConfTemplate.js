var env = require('../environment.js');

module.exports = function(framework) {
  return {
    mockSelenium: true,

    framework: framework,

    specs: [
      framework != 'cucumber' ? 'specs/simple_spec.js' :
          'features/simple.feature'
    ],

    capabilities: env.capabilities,

    baseUrl: env.baseUrl,

    plugins: [{
      path: 'plugins/post_test_plugin.js'
    }]
  };
};
