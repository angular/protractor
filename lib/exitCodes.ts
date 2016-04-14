import {Logger} from './logger2';

const CONFIG_ERROR_CODE = 105;

export class ProtractorError {
  error: Error;
  description: string;
  code: number;
  stack: string;
  constructor(logger: Logger, description: string, code: number) {
    this.error = new Error();
    this.description = description;
    this.code = code;
    logger.error('error code: ' + this.code);
    logger.error('description: ' + this.description);
    this.stack = this.error.stack;
  }
}

/**
 * Configuration file error
 */
export class ConfigError extends ProtractorError {
  static CODE = CONFIG_ERROR_CODE;
  constructor(logger: Logger, description: string) {
    super(logger, description, ConfigError.CODE);
  }
}
