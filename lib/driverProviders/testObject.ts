/*
 * This is an implementation of the TestObject Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import {Config} from '../config';
import {Logger} from '../logger';
import {DriverProvider} from './driverProvider';

let logger = new Logger('testobject');

export class TestObject extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {Promise} A promise which will resolve when the environment is
   *      ready to test.
   */
  protected async setupDriverEnv(): Promise<any> {
    this.config_.capabilities['testobject.user'] = this.config_.testobjectUser;
    this.config_.capabilities['testobject_api_key'] = this.config_.testobjectKey;
    this.config_.seleniumAddress = 'https://us1.appium.testobject.com/wd/hub';

    logger.info('Using TestObject selenium server at ' + this.config_.seleniumAddress);
  }
}
