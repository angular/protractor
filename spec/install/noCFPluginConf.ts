import * as q from 'q';
import {Config, protractor} from 'protractor';
import {promise as wdpromise} from 'selenium-webdriver';
const env = require('../../environment');

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
        //TODO: remove cast when @types/selenium-webdriver understands disabling the control flow
        return (q.delay(100) as any as wdpromise.Promise<void>).then(function() {
          (protractor as any).ON_PAGE_LOAD = true;
        });
      }
    }
  }],

  SELENIUM_PROMISE_MANAGER: false
};
