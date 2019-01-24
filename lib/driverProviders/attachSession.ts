/*
 *  This is an implementation of the Attach Session Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import {Session, WebDriver} from 'selenium-webdriver';
import {Executor, HttpClient} from 'selenium-webdriver/http';

import {Config} from '../config';
import {Logger} from '../logger';
import {DriverProvider} from './driverProvider';

let logger = new Logger('attachSession');

export class AttachSession extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {Promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected async setupDriverEnv(): Promise<any> {
    logger.info('Using the selenium server at ' + this.config_.seleniumAddress);
    logger.info('Using session id - ' + this.config_.seleniumSessionId);
  }

  /**
   * Getting a new driver by attaching an existing session.
   *
   * @public
   * @return {WebDriver} webdriver instance
   */
  async getNewDriver(): Promise<WebDriver> {
    const httpClient: HttpClient = new HttpClient(this.config_.seleniumAddress);
    const executor: Executor = new Executor(httpClient);
    const session: Session = new Session(this.config_.seleniumSessionId, null);

    const newDriver = new WebDriver(session, executor);
    this.drivers_.push(newDriver);
    return newDriver;
  }

  /**
   * Maintains the existing session and does not quit the driver.
   *
   * @public
   */
  async quitDriver(): Promise<void> {}
}
