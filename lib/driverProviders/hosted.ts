/*
 *  This is an implementation of the Hosted Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
import * as q from 'q';
import * as util from 'util';

import {Config} from '../configParser';
import {DriverProvider} from './driverProvider';
import {Logger} from '../logger2';

let logger = new Logger('hosted');
export class Hosted extends DriverProvider {
  constructor(config: Config) { super(config); }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  setupEnv(): q.Promise<any> {
    logger.info('Using the selenium server at ' + this.config_.seleniumAddress);
    return q.fcall(function() {});
  }
}
