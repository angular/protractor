"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CONFIG_ERROR_CODE = 105;
var BROWSER_CONNECT_ERROR_CODE = 135;
var KITCHEN_SINK_CODE = 199;
var ProtractorError = (function (_super) {
    __extends(ProtractorError, _super);
    function ProtractorError(logger, message, code, error) {
        _super.call(this, message);
        this.message = message;
        this.code = code;
        this.captureStackTrace();
        // replacing the stack trace with the thrown error stack trace.
        if (error) {
            var protractorError = error;
            this.stack = protractorError.stack;
        }
        this.logError(logger);
        if (!ProtractorError.SUPRESS_EXIT_CODE) {
            process.exit(this.code);
        }
    }
    /**
     * Captures the stack trace to this.stack from the Error.captureStackTrace.
     * this allows us to capture the error of this error object. Note:
     * called with Error set to any to quiet typescript warnings.
     */
    ProtractorError.prototype.captureStackTrace = function () {
        Error.captureStackTrace(this, this.constructor);
    };
    ProtractorError.prototype.logError = function (logger) {
        ProtractorError.log(logger, this.code, this.message, this.stack);
    };
    ProtractorError.log = function (logger, code, message, stack) {
        var messages = message.split('\n');
        if (messages.length > 1) {
            message = messages[0];
        }
        logger.error('Error code: ' + code);
        logger.error('Error message: ' + message);
        logger.error(stack);
    };
    ProtractorError.CODE = KITCHEN_SINK_CODE;
    ProtractorError.SUPRESS_EXIT_CODE = false;
    return ProtractorError;
}(Error));
exports.ProtractorError = ProtractorError;
/**
 * Configuration file error
 */
var ConfigError = (function (_super) {
    __extends(ConfigError, _super);
    function ConfigError(logger, message, error) {
        _super.call(this, logger, message, ConfigError.CODE, error);
    }
    ConfigError.CODE = CONFIG_ERROR_CODE;
    return ConfigError;
}(ProtractorError));
exports.ConfigError = ConfigError;
/**
 * Browser errors including getting a driver session, direct connect, etc.
 */
var BrowserError = (function (_super) {
    __extends(BrowserError, _super);
    function BrowserError(logger, message) {
        _super.call(this, logger, message, BrowserError.CODE);
    }
    BrowserError.CODE = BROWSER_CONNECT_ERROR_CODE;
    BrowserError.ERR_MSGS = [
        'ECONNREFUSED connect ECONNREFUSED', 'Sauce Labs Authentication Error',
        'Invalid username or password'
    ];
    return BrowserError;
}(ProtractorError));
exports.BrowserError = BrowserError;
var ErrorHandler = (function () {
    function ErrorHandler() {
    }
    ErrorHandler.isError = function (errMsgs, e) {
        if (errMsgs && errMsgs.length > 0) {
            for (var errPos in errMsgs) {
                var errMsg = errMsgs[errPos];
                if (e.message.indexOf(errMsg) !== -1) {
                    return true;
                }
            }
        }
        return false;
    };
    ErrorHandler.parseError = function (e) {
        if (ErrorHandler.isError(ConfigError.ERR_MSGS, e)) {
            return ConfigError.CODE;
        }
        if (ErrorHandler.isError(BrowserError.ERR_MSGS, e)) {
            return BrowserError.CODE;
        }
        return null;
    };
    return ErrorHandler;
}());
exports.ErrorHandler = ErrorHandler;
