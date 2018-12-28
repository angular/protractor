// This is spec file is automatically added by protractor to implement our
// `afterEach` functionality for jasmine and mocha.

import {hooks} from '../../built/frameworks/setupAfterEach';

afterEach(function() {
  if (hooks.afterEach) {
    return hooks.afterEach();
  }
});
