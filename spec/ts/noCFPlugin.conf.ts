import {Config, protractor} from '../..';
const env = require('../environment.js');

export let config: Config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'plugin/plugin_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  SELENIUM_PROMISE_MANAGER: false,

  plugins: [{
    inline: {
      onPageLoad: async function() {
        await new Promise(resolve => {
          setTimeout(resolve, 100);
        });
        (protractor as any).ON_PAGE_LOAD = true;
      }
    }
  }]
};
