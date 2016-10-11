/*
 *  This is an implementation of the Hosted Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as q from 'q';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let logger = new Logger('hosted');
export class Hosted extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected setupDriverEnv(): q.Promise<any> {
    logger.info('Using the selenium server at ' + this.config_.seleniumAddress);
    return q.fcall(function() {});
  }
}
