/*
 * This is an implementation of the SauceLabs Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

import * as q from 'q';
import {Session, WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let logger = new Logger('Perfecto');
export class Perfecto extends DriverProvider {
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
    let deferred = q.defer();
         console.log("In Perfectot "+this.config_.perfectoUser)

    this.config_.capabilities['user'] = this.config_.perfectoUser;
    this.config_.capabilities['password'] = this.config_.perfectoPassword;
    this.config_.capabilities['securityToken'] = this.config_.perfectoToken;

         logger.info('Using Perfecto server' + this.config_.seleniumAddress);
         deferred.resolve();
         return deferred.promise;
  }
}
