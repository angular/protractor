import {Config} from 'protractor';

var env = require('../../environment');

export let config: Config = {
  seleniumAddress: env.seleniumAddress,
  capabilities: env.capabilities,
  specs: [
    'browserts_spec.js',
    'browserjs_spec.js'
  ],
  framework: 'jasmine'
}
