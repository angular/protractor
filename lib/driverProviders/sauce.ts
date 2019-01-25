/*
 * This is an implementation of the SauceLabs Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */

import {WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

const SauceLabs = require('saucelabs');
const SAUCE_REGIONS: {[key: string]: string} = {
  'us': '',  // default endpoint
  'eu': 'eu-central-1.'
};

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
    let mappedDrivers = this.drivers_.map(async (driver: WebDriver) => {
      const session = await driver.getSession();
      logger.info('SauceLabs results available at http://saucelabs.com/jobs/' + session.getId());
      this.sauceServer_.updateJob(session.getId(), update, (err: Error) => {
        if (err) {
          throw new Error('Error updating Sauce pass/fail status: ' + util.inspect(err));
        }
      });
    });
    return Promise.all(mappedDrivers);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @public
   * @return {Promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected async setupDriverEnv(): Promise<any> {
    this.sauceServer_ = new SauceLabs({
      hostname: this.getSauceEndpoint(this.config_.sauceRegion),
      username: this.config_.sauceUser,
      password: this.config_.sauceKey,
      agent: this.config_.sauceAgent,
      proxy: this.config_.sauceProxy
    });
    this.config_.capabilities['username'] = this.config_.sauceUser;
    this.config_.capabilities['accessKey'] = this.config_.sauceKey;
    this.config_.capabilities['build'] = this.config_.sauceBuild;
    let protocol = this.config_.sauceSeleniumUseHttp ? 'http://' : 'https://';
    let auth = protocol + this.config_.sauceUser + ':' + this.config_.sauceKey + '@';
    this.config_.seleniumAddress = auth +
        (this.config_.sauceSeleniumAddress ?
             this.config_.sauceSeleniumAddress :
             `ondemand.${this.getSauceEndpoint(this.config_.sauceRegion)}:443/wd/hub`);

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    if (this.config_.capabilities.name && this.config_.capabilities.shardTestFiles) {
      this.config_.capabilities.name +=
          (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
    }

    logger.info(
        'Using SauceLabs selenium server at ' +
        this.config_.seleniumAddress.replace(/\/\/.+@/, '//'));
  }

  /**
   * Get the Sauce Labs endpoint
   * @private
   * @param {string} region
   * @return {string} The endpoint that needs to be used
   */
  private getSauceEndpoint(region: string): string {
    const dc = region ?
        typeof SAUCE_REGIONS[region] !== 'undefined' ? SAUCE_REGIONS[region] : (region + '.') :
        '';
    return `${dc}saucelabs.com`;
  }
}
