/*
 * This is an implementation of the Browserstack Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
import * as https from 'https';
import * as q from 'q';
import {Session, WebDriver} from 'selenium-webdriver';
import * as util from 'util';

import {Config} from '../config';
import {BrowserError} from '../exitCodes';
import {Logger} from '../logger';

import {DriverProvider} from './driverProvider';

let logger = new Logger('browserstack');

export class BrowserStack extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Hook to update the BrowserStack job status.
   * @public
   * @param {Object} update
   * @return {q.promise} A promise that will resolve when the update is complete.
   */
  updateJob(update: any): q.Promise<any> {
    let deferredArray = this.drivers_.map((driver: WebDriver) => {
      let deferred = q.defer();
      driver.getSession().then((session: Session) => {
        let headers: Object = {
          'Content-Type': 'application/json',
          'Authorization': 'Basic ' +
              new Buffer(this.config_.browserstackUser + ':' + this.config_.browserstackKey)
                  .toString('base64')
        };
        let options = {
          hostname: 'www.browserstack.com',
          port: 443,
          path: '/automate/sessions/' + session.getId() + '.json',
          method: 'GET',
          headers: headers
        };

        let req = https.request(options, (res) => {
          res.on('data', (data: Buffer) => {
            let info = JSON.parse(data.toString());
            if (info && info.automation_session && info.automation_session.browser_url) {
              logger.info(
                  'BrowserStack results available at ' + info.automation_session.browser_url);
            } else {
              logger.info(
                  'BrowserStack results available at ' +
                  'https://www.browserstack.com/automate');
            }
          });
        });
        req.end();
        req.on('error', (e: Error) => {
          logger.info(
              'BrowserStack results available at ' +
              'https://www.browserstack.com/automate');
        });
        let jobStatus = update.passed ? 'completed' : 'error';
        options.method = 'PUT';
        let update_req = https.request(options, (res) => {
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
                logger, 'Error updating BrowserStack pass/fail status: ' + util.inspect(e));
          });
        });
        update_req.write('{"status":"' + jobStatus + '"}');
        update_req.end();
      });
      return deferred.promise;
    });
    return q.all(deferredArray);
  }

  /**
   * Configure and launch (if applicable) the object's environment.
   * @return {q.promise} A promise which will resolve when the environment is
   *     ready to test.
   */
  protected setupDriverEnv(): q.Promise<any> {
    let deferred = q.defer();
    this.config_.capabilities['browserstack.user'] = this.config_.browserstackUser;
    this.config_.capabilities['browserstack.key'] = this.config_.browserstackKey;
    this.config_.seleniumAddress = 'http://hub.browserstack.com/wd/hub';

    // Append filename to capabilities.name so that it's easier to identify
    // tests.
    if (this.config_.capabilities.name && this.config_.capabilities.shardTestFiles) {
      this.config_.capabilities.name +=
          (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
    }

    logger.info('Using BrowserStack selenium server at ' + this.config_.seleniumAddress);
    deferred.resolve();
    return deferred.promise;
  }
}
