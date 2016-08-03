import {Config} from 'protractor';

export let config: Config = {
  mockSelenium: true,
  specs: ['*_spec.js'],
  framework: 'jasmine'
}
