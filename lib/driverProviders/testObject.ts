/*
 * This is an implementation of the TestObject Driver Provider.
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

let logger = new Logger('testobject');

export class TestObject extends DriverProvider {
  constructor(config: Config) {
    super(config);
  }

  /**
   * Hook to update the TestObject job status.
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
              new Buffer(this.config_.testobjectUser + ':' + this.config_.testobjectKey)
                  .toString('base64')
        };

        let req = https.request(options, (res) => {
          res.on('data', (data: Buffer) => {
            let info = JSON.parse(data.toString());
            if (info && info.automation_session && info.automation_session.browser_url) {
              logger.info(
                  'TestObject results available at ' + info.automation_session.browser_url);
            } else {
              logger.info(
                  'TestObject results available at ' +
                  'https://app.testobject.com/#');
            }
          });
        });
        req.end();
        req.on('error', (e: Error) => {
          logger.info(
              'TestObject results available at ' +
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
                logger, 'Error updating TestObject pass/fail status: ' + util.inspect(e));
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
    this.config_.capabilities['testobject.user'] = this.config_.testobjectUser;
    this.config_.capabilities['testobject.key'] = this.config_.testobjectKey;
    this.config_.seleniumAddress = 'https://us1.appium.testobject.com/wd/hub';

    logger.info('Using TestObject selenium server at ' + this.config_.seleniumAddress);
    deferred.resolve();
    return deferred.promise;
  }
}
