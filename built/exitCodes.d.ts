import { Logger } from './logger2';
export declare class ProtractorError {
    error: Error;
    description: string;
    code: number;
    stack: string;
    constructor(logger: Logger, description: string, code: number);
}
/**
 * Configuration file error
 */
export declare class ConfigError extends ProtractorError {
    static CODE: number;
    constructor(logger: Logger, description: string);
}
