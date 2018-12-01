import {Logger} from '../logger';
import {Runner} from '../runner';
import * as util from 'util';

const logger = new Logger('debugger');

/**
 * A debug framework which does not actually run any tests, just spits
 * out the list that would be run.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {Promise} Promise resolved with the test results
 */
export const run = (runner: Runner, specs: Array<string>) => {
  return new Promise(resolve => {
    logger.info(`Resolved spec files: ${util.inspect(specs)}`);
    resolve({failedCount: 0});
  });
};