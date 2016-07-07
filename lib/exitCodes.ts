import {Logger} from './logger';

const CONFIG_ERROR_CODE = 105;
const BROWSER_CONNECT_ERROR_CODE = 135;
const KITCHEN_SINK_CODE = 199;

export class ProtractorError extends Error {
  static ERR_MSGS: string[];
  static CODE = KITCHEN_SINK_CODE;
  static SUPRESS_EXIT_CODE = false;

  message:
      string;  // a one liner, if more than one line is sent, it will be cut off
  stack: string;  // has the message with the stack trace
  code: number;

  /**
   * Captures the stack trace to this.stack from the Error.captureStackTrace.
   * this allows us to capture the error of this error object. Note:
   * called with Error set to any to quiet typescript warnings.
   */
  captureStackTrace() {
    (Error as any).captureStackTrace(this, this.constructor);
  }

  constructor(logger: Logger, message: string, code: number, error?: Error) {
    super(message);
    this.message = message;
    this.code = code;
    this.captureStackTrace();

    // replacing the stack trace with the thrown error stack trace.
    if (error) {
      let protractorError = error as ProtractorError;
      this.stack = protractorError.stack;
    }
    this.logError(logger);

    if (!ProtractorError.SUPRESS_EXIT_CODE) {
      process.exit(this.code);
    }
  }

  logError(logger: Logger) {
    ProtractorError.log(logger, this.code, this.message, this.stack);
  }

  static log(logger: Logger, code: number, message: string, stack: string) {
    let messages = message.split('\n');
    if (messages.length > 1) {
      message = messages[0];
    }
    logger.error('Error code: ' + code);
    logger.error('Error message: ' + message);
    logger.error(stack);
  }
}

/**
 * Configuration file error
 */
export class ConfigError extends ProtractorError {
  static CODE = CONFIG_ERROR_CODE;
  constructor(logger: Logger, message: string, error?: Error) {
    super(logger, message, ConfigError.CODE, error);
  }
}

/**
 * Browser errors including getting a driver session, direct connect, etc.
 */
export class BrowserError extends ProtractorError {
  static CODE = BROWSER_CONNECT_ERROR_CODE;
  static ERR_MSGS = [
    'ECONNREFUSED connect ECONNREFUSED', 'Sauce Labs Authentication Error',
    'Invalid username or password'
  ];
  constructor(logger: Logger, message: string) {
    super(logger, message, BrowserError.CODE);
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
