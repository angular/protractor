import {Config} from '../..';
const env = require('../environment.js');

export let config: Config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'basic/*_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  SELENIUM_PROMISE_MANAGER: false
};
