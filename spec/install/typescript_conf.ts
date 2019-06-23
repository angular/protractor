import {Config} from 'protractor';

export let config: Config = {
  mockSelenium: true,
  SELENIUM_PROMISE_MANAGER: false,
  specs: ['typescript_spec.js'],
  framework: 'jasmine'
}
