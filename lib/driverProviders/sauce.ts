/*
 * This is an implementation of the SauceLabs Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import {Session, WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

const SauceLabs = require('saucelabs');

let logger = new Logger('sauce');
export class Sauce extends DriverProvider {
  sauceServer_: any;

  constructor(config: Config) {
    super(config);
  }

  /**
   * Hook to update the sauce job.
   * @public
   * @param {Object} update
   * @return {Promise} A promise that will resolve when the update is complete.
   */
  updateJob(update: any): Promise<any> {
    let deferredArray = this.drivers_.map((driver: WebDriver) => {
      let deferredResolve: () => void;
      let deferredReject: () => void;
      let deferred = new Promise((resolve, reject) => {
        deferredResolve = resolve;
        deferredReject = reject;
      });
      driver.getSession().then((session: Session) => {
        logger.info('SauceLabs results available at http://saucelabs.com/jobs/' + session.getId());
        this.sauceServer_.updateJob(session.getId(), update, (err: Error) => {
          if (err) {
            throw new Error('Error updating Sauce pass/fail status: ' + util.inspect(err));
          }
          deferredResolve();
        });
      });
      return deferred;
    });
    return Promise.all(deferredArray);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {Promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected setupDriverEnv(): Promise<any> {
    this.sauceServer_ = new SauceLabs({
      username: this.config_.sauceUser,
      password: this.config_.sauceKey,
      agent: this.config_.sauceAgent,
      proxy: this.config_.webDriverProxy
    });
    this.config_.capabilities['username'] = this.config_.sauceUser;
    this.config_.capabilities['accessKey'] = this.config_.sauceKey;
    this.config_.capabilities['build'] = this.config_.sauceBuild;
    let auth = 'https://' + this.config_.sauceUser + ':' + this.config_.sauceKey + '@';
    let configAddress = this.config_.sauceSeleniumAddress;
    let address = configAddress || 'ondemand.saucelabs.com:443/wd/hub';
    this.config_.seleniumAddress = auth + address;

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    if (this.config_.capabilities.name && this.config_.capabilities.shardTestFiles) {
      this.config_.capabilities.name +=
          (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
    }

    logger.info(
        'Using SauceLabs selenium server at ' +
        this.config_.seleniumAddress.replace(/\/\/.+@/, '//'));
    return Promise.resolve();
  }
}
