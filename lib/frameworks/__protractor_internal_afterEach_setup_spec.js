// This is spec file is automatically added by protractor to implement our
// `afterEach` functionality for jasmine and mocha.

var hooks = require('./setupAfterEach').hooks;

afterEach(function() {
  if (hooks.afterEach) { 
    return hooks.afterEach();
  }
});
