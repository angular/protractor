/*
 * This is an implementation of the Browserstack Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import * as https from 'https';
import * as q from 'q';
import * as util from 'util';

import {BrowserError} from '../exitCodes';
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
        let headers: Object = {
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' +
                new Buffer(
                    this.config_.browserstackUser + ':' +
                    this.config_.browserstackKey)
                    .toString('base64')
        };
        let options = {
          hostname: 'www.browserstack.com',
          port: 443,
          path: '/automate/sessions/' + session.getId() + '.json',
          method: 'PUT',
          headers: headers
        };
        https
            .request(
                options,
                (res) => {
                  let responseStr = '';
                  res.on('data', (data: Buffer) => {
                    responseStr += data.toString();
                  });
                  res.on('end', () => {
                    logger.info(responseStr);
                    deferred.resolve();
                  });
                  res.on('error', (e: Error) => {
                    throw new BrowserError(
                        logger,
                        'Error updating BrowserStack pass/fail status: ' +
                            util.inspect(e));
                  });
                })
            .write('{\'status\': ' + jobStatus + '}');
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