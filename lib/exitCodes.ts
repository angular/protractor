import * as Logger from './logger';

export class ProtractorError extends Error {
  msg: string;
  code: number;
  constructor(msg: string, code: number) {
    super(msg);
    this.msg = msg;
    this.code = code;
    Logger.error('error code: ' + this.code + ' - ' + this.msg);
  }
}

const CONFIG_ERROR_CODE = 105;

/**
 * Configuration file error
 */
export class ConfigError extends ProtractorError {
  constructor(msg: string) { super(msg, CONFIG_ERROR_CODE); }
}
