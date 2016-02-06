var env = require('./environment.js');

exports.config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'attachSessionProvider/attachSession_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: 'http://localhost:8081',

  // Special option for Angular2, to test against all Angular2 applications
  // on the page. This means that Protractor will wait for every app to be
  // stable before each action, and search within all apps when finding
  // elements.
  useAllAngular2AppRoots: true
};
