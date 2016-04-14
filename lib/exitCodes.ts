import {Logger} from './logger2';

const CONFIG_ERROR_CODE = 105;
const BROWSER_ERROR_CODE = 135;

export class ProtractorError extends Error {
  static ERR_MSGS: string[];
  static DEFAULT_MSG = 'protractor encountered an error';

  error: Error;
  description: string;
  code: number;
  stack: string;
  constructor(logger: Logger, description: string, code: number) {
    super();
    this.error = new Error();
    this.code = code;
    this.description = description;
    this.stack = this.error.stack;
    this.logError(logger);
  }

  logError(logger: Logger) {
    logger.error('error code: ' + this.code);
    logger.error('description: ' + this.description);
    logger.error(this.stack);
  }
}
/**
 * Configuration file error
 */
export class ConfigError extends ProtractorError {
  static DEFAULT_MSG = 'configuration error';
  static CODE = CONFIG_ERROR_CODE;
  constructor(logger: Logger, opt_msg?: string) {
    super(logger, opt_msg || ConfigError.DEFAULT_MSG, ConfigError.CODE);
  }
}

/**
 * Browser errors including getting a driver session, direct connect, etc.
 */
export class BrowserError extends ProtractorError {
  static DEFAULT_MSG = 'browser error';
  static CODE = BROWSER_ERROR_CODE;
  static ERR_MSGS =
      ['ECONNREFUSED connect ECONNREFUSED', 'Sauce Labs Authentication Error'];
  constructor(logger: Logger, opt_msg?: string) {
    super(logger, opt_msg || BrowserError.DEFAULT_MSG, BrowserError.CODE);
  }
}

export class ErrorHandler {
  static isError(errMsgs: string[], e: Error): boolean {
    if (errMsgs && errMsgs.length > 0) {
      for (let errPos in errMsgs) {
        let errMsg = errMsgs[errPos];
        if (e.message.indexOf(errMsg) !== -1) {
          return true;
        }
      }
    }
    return false;
  }

  static parseError(e: Error): number {
    if (ErrorHandler.isError(ConfigError.ERR_MSGS, e)) {
      return ConfigError.CODE;
    }
    if (ErrorHandler.isError(BrowserError.ERR_MSGS, e)) {
      return BrowserError.CODE;
    }
    return null;
  }
}
