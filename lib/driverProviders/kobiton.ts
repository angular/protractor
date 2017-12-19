/*
 * This is an implementation of the Kobiton Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import * as q from 'q';
import {Config} from '../config';
import {Logger} from '../logger';
import {DriverProvider} from './driverProvider';

let logger = new Logger('kobiton');

export class Kobiton extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {q.promise} A promise which will resolve when the environment is
   *      ready to test.
   */
  protected setupDriverEnv(): q.Promise<any> {
    let deferred = q.defer();
    this.config_.capabilities['kobitonUser'] = this.config_.kobitonUser;
    this.config_.capabilities['kobitonKey'] = this.config_.kobitonKey;
    this.config_.seleniumAddress = 'https://' + this.config_.kobitonUser + ':' +
        this.config_.kobitonKey + '@api.kobiton.com/wd/hub';

    logger.info('Using Kobiton selenium server at ' + this.config_.seleniumAddress);
    deferred.resolve();
    return deferred.promise;
  }
}
