"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var CONFIG_ERROR_CODE = 105;
var ProtractorError = (function () {
    function ProtractorError(logger, description, code) {
        this.error = new Error();
        this.description = description;
        this.code = code;
        logger.error('error code: ' + this.code);
        logger.error('description: ' + this.description);
        this.stack = this.error.stack;
    }
    return ProtractorError;
}());
exports.ProtractorError = ProtractorError;
/**
 * Configuration file error
 */
var ConfigError = (function (_super) {
    __extends(ConfigError, _super);
    function ConfigError(logger, description) {
        _super.call(this, logger, description, ConfigError.CODE);
    }
    ConfigError.CODE = CONFIG_ERROR_CODE;
    return ConfigError;
}(ProtractorError));
exports.ConfigError = ConfigError;
