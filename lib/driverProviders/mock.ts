/*
 * This is an mock implementation of the Driver Provider.
 * It returns a fake webdriver and never actually contacts a selenium
 * server.
 */
import * as q from 'q';
import {Session, WebDriver} from 'selenium-webdriver';
import * as executors from 'selenium-webdriver/executors';

import {Config} from '../config';
import {DriverProvider} from './driverProvider';

export class MockExecutor {
  execute(command: any): any {}
}

export class Mock extends DriverProvider {
  constructor(config?: Config) {
    super(config);
  }

  /**
   * An execute function that returns a promise with a test value.
   */
  execute(): q.Promise<any> {
    let deferred = q.defer();
    deferred.resolve({value: 'test_response'});
    return deferred.promise;
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve immediately.
   */
  protected setupDriverEnv(): q.Promise<any> {
    return q.fcall(function() {});
  }

  /**
   * Create a new driver.
   *
   * @public
   * @override
   * @return webdriver instance
   */
  getNewDriver(): WebDriver {
    let mockSession = new Session('test_session_id', {});
    let newDriver = new WebDriver(mockSession, new MockExecutor());
    this.drivers_.push(newDriver);
    return newDriver;
  }
}
