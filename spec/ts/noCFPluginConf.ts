import * as q from 'q';
import {Config, protractor} from '../..';
const env = require('../environment.js');

export let config: Config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'noCF/plugin_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  plugins: [{
    inline: {
      onPageLoad: function() {
        return q.delay(100).then(function() {
          (protractor as any).ON_PAGE_LOAD = true;
        });
      }
    }
  }],

  SELENIUM_PROMISE_MANAGER: false
};
