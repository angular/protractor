import {Config} from 'protractor';

export let config: Config = {
  mockSelenium: true,
  specs: ['typescript_spec.js'],
  framework: 'jasmine'
}
