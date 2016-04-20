/*
 * This is an implementation of the Browserstack Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import * as request from 'request';
import * as q from 'q';
import * as util from 'util';

import {Config} from '../configParser';
import {DriverProvider} from './driverProvider';
import {Logger} from '../logger2';

let logger = new Logger('browserstack');

export class BrowserStack extends DriverProvider {
  constructor(config: Config) { super(config); }

  /**
   * Hook to update the BrowserStack job status.
   * @public
   * @param {Object} update
   * @return {q.promise} A promise that will resolve when the update is complete.
   */
  updateJob(update: any): q.Promise<any> {
    let deferredArray = this.drivers_.map((driver: webdriver.WebDriver) => {
      let deferred = q.defer();
      driver.getSession().then((session: webdriver.Session) => {
        var jobStatus = update.passed ? 'completed' : 'error';
        logger.info(
            'BrowserStack results available at ' +
            'https://www.browserstack.com/automate');
        request(
            {
              url: 'https://www.browserstack.com/automate/sessions/' +
                  session.getId() + '.json',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' +
                    new Buffer(
                        this.config_.browserstackUser + ':' +
                        this.config_.browserstackKey)
                        .toString('base64')
              },
              method: 'PUT',
              form: {'status': jobStatus}
            },
            (error: Error) => {
              if (error) {
                throw new Error(
                    'Error updating BrowserStack pass/fail status: ' +
                    util.inspect(error));
              }
            });
        deferred.resolve();
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
    var deferred = q.defer();
    this.config_.capabilities['browserstack.user'] =
        this.config_.browserstackUser;
    this.config_.capabilities['browserstack.key'] =
        this.config_.browserstackKey;
    this.config_.seleniumAddress = 'http://hub.browserstack.com/wd/hub';

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    if (this.config_.capabilities.name &&
        this.config_.capabilities.shardTestFiles) {
      this.config_.capabilities.name +=
          (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
    }

    logger.info(
        'Using BrowserStack selenium server at ' +
        this.config_.seleniumAddress);
    deferred.resolve();
    return deferred.promise;
  }
}
