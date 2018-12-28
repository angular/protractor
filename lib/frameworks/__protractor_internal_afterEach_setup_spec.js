// This is spec file is automatically added by protractor to implement our
// `afterEach` functionality for jasmine and mocha.

const hooks = require('../../built/frameworks/setupAfterEach').hooks;

afterEach(function() {
  if (hooks.afterEach) {
    return hooks.afterEach();
  }
});
