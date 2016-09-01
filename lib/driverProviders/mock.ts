/*
 * This is an mock implementation of the Driver Provider.
 * It returns a fake webdriver and never actually contacts a selenium
 * server.
 */
import * as util from 'util';
import {Config} from '../config';
import {DriverProvider} from './driverProvider';

let webdriver = require('selenium-webdriver');

export class Mock extends DriverProvider {
  constructor(config?: Config) { super(config); }

  /**
   * An execute function that returns a promise with a test value.
   */
  execute(): Promise<any> {
    return new Promise(
        (resolve, reject) => { resolve({value: 'test_response'}); });
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve immediately.
   */
  setupEnv(): Promise<any> {
    return new Promise((resolve, reject) => { resolve(); });
  }

  /**
   * Create a new driver.
   *
   * @public
   * @override
   * @return webdriver instance
   */
  getNewDriver(): webdriver.WebDriver {
    let mockSession = new webdriver.Session('test_session_id', {});
    let newDriver = new webdriver.WebDriver(mockSession, new Mock());
    this.drivers_.push(newDriver);
    return newDriver;
  }
}
