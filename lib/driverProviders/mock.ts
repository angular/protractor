/*
 * This is an mock implementation of the Driver Provider.
 * It returns a fake webdriver and never actually contacts a selenium
 * server.
 */
import {Session, WebDriver} from 'selenium-webdriver';

import {Config} from '../config';
import {DriverProvider} from './driverProvider';

export class MockExecutor {
  execute(_: any): any {}
}

export class Mock extends DriverProvider {
  constructor(config?: Config) {
    super(config);
  }

  /**
   * An execute function that returns a promise with a test value.
   */
  async execute(): Promise<any> {
    return {value: 'test_response'};
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {Promise} A promise which will resolve immediately.
   */
  protected async setupDriverEnv(): Promise<any> {}

  /**
   * Create a new driver.
   *
   * @public
   * @override
   * @return webdriver instance
   */
  async getNewDriver(): Promise<WebDriver> {
    const mockSession: Session = new Session('test_session_id', {});
    const newDriver: WebDriver = new WebDriver(mockSession, new MockExecutor());
    this.drivers_.push(newDriver);
    return newDriver;
  }
}
