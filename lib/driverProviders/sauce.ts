/*
 * This is an implementation of the SauceLabs Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

import * as q from 'q';
import * as util from 'util';

import {Config} from '../config';
import {DriverProvider} from './driverProvider';
import {Logger} from '../logger2';

let SauceLabs = require('saucelabs');

let logger = new Logger('sauce');
export class Sauce extends DriverProvider {
  sauceServer_: any;

  constructor(config: Config) { super(config); }

  /**
   * Hook to update the sauce job.
   * @public
   * @param {Object} update
   * @return {q.promise} A promise that will resolve when the update is complete.
   */
  updateJob(update: any): q.Promise<any> {
    var deferredArray = this.drivers_.map((driver: webdriver.WebDriver) => {
      var deferred = q.defer();
      driver.getSession().then((session: webdriver.Session) => {
        logger.info(
            'SauceLabs results available at http://saucelabs.com/jobs/' +
            session.getId());
        this.sauceServer_.updateJob(session.getId(), update, (err: Error) => {
          if (err) {
            throw new Error(
                'Error updating Sauce pass/fail status: ' + util.inspect(err));
          }
          deferred.resolve();
        });
      });
      return deferred.promise;
    });
    return q.all(deferredArray);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  setupEnv(): q.Promise<any> {
    let deferred = q.defer();
    this.sauceServer_ = new SauceLabs({
      username: this.config_.sauceUser,
      password: this.config_.sauceKey,
      agent: this.config_.sauceAgent
    });
    this.config_.capabilities['username'] = this.config_.sauceUser;
    this.config_.capabilities['accessKey'] = this.config_.sauceKey;
    this.config_.capabilities['build'] = this.config_.sauceBuild;
    let auth =
        'http://' + this.config_.sauceUser + ':' + this.config_.sauceKey + '@';
    this.config_.seleniumAddress =
        auth + (this.config_.sauceSeleniumAddress ?
                    this.config_.sauceSeleniumAddress :
                    'ondemand.saucelabs.com:80/wd/hub');

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    if (this.config_.capabilities.name &&
        this.config_.capabilities.shardTestFiles) {
      this.config_.capabilities.name +=
          (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
    }

    logger.info(
        'Using SauceLabs selenium server at ' +
        this.config_.seleniumAddress.replace(/\/\/.+@/, '//'));
    deferred.resolve();
    return deferred.promise;
  }
}
