import {Config} from '../..';
const env = require('../../environment');

export let config: Config = {
  seleniumAddress: env.seleniumAddress,

  framework: 'jasmine',

  specs: [
    'noCF/smoke_spec.js'
  ],

  capabilities: env.capabilities,

  baseUrl: env.baseUrl + '/ng1/',

  SELENIUM_PROMISE_MANAGER: false
};
