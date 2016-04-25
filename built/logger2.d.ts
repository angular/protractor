import { Config } from './configParser';
export declare enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3,
}
export declare enum WriteTo {
    CONSOLE = 0,
    FILE = 1,
    BOTH = 2,
    NONE = 3,
}
/**
 * Logger class adds timestamp output, log levels, and identifiers to help
 * when debugging. Also could write to console, file, both, or none.
 */
export declare class Logger {
    private id;
    static logLevel: LogLevel;
    static showTimestamp: boolean;
    static showId: boolean;
    static writeTo: WriteTo;
    static fd: any;
    static firstWrite: boolean;
    /**
     * Set up the logging configuration from the protractor configuration file.
     * @param config The protractor configuration
     */
    static set(config: Config): void;
    /**
     * Set up the write location. If writing to a file, get the file descriptor.
     * @param writeTo The enum for where to write the logs.
     * @param opt_logFile An optional parameter to override the log file location.
     */
    static setWrite(writeTo: WriteTo, opt_logFile?: string): void;
    /**
     * Creates a logger instance with an ID for the logger.
     * @constructor
     */
    constructor(id: string);
    /**
     * Log INFO
     * @param ...msgs multiple arguments to be logged.
     */
    info(...msgs: any[]): void;
    /**
     * Log DEBUG
     * @param ...msgs multiple arguments to be logged.
     */
    debug(...msgs: any[]): void;
    /**
     * Log WARN
     * @param ...msgs multiple arguments to be logged.
     */
    warn(...msgs: any[]): void;
    /**
     * Log ERROR
     * @param ...msgs multiple arguments to be logged.
     */
    error(...msgs: any[]): void;
    /**
     * For the log level set, check to see if the messages should be logged.
     * @param logLevel The log level of the message.
     * @param msgs The messages to be logged
     */
    log_(logLevel: LogLevel, msgs: any[]): void;
    /**
     * Format with timestamp, log level, identifier, and message and log to
     * specified medium (console, file, both, none).
     * @param logLevel The log level of the message.
     * @param msgs The messages to be logged.
     */
    print_(logLevel: LogLevel, msgs: any[]): void;
    /**
     * Get a timestamp formatted with [hh:mm:ss]
     * @param writeTo The enum for where to write the logs.
     * @return The string of the formatted timestamp
     */
    static timestamp_(writeTo: WriteTo): string;
    /**
     * Get the identifier of the logger as '/<id>'
     * @param logLevel The log level of the message.
     * @param writeTo The enum for where to write the logs.
     * @return The string of the formatted id
     */
    static id_(logLevel: LogLevel, id: string, writeTo: WriteTo): string;
    /**
     * Get the log level formatted with the first letter. For info, it is I.
     * @param logLevel The log level of the message.
     * @param writeTo The enum for where to write the logs.
     * @return The string of the formatted log level
     */
    static level_(logLevel: LogLevel, id: string, writeTo: WriteTo): string;
    /**
     * Convert the list of messages to a single string message.
     * @param msgs The list of messages.
     * @return The string of the formatted messages
     */
    static msgToFile_(msgs: any[]): string;
}
