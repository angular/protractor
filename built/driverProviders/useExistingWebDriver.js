"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
/*
 *  This is an implementation of the Use Existing WebDriver Driver Provider.
 *  It is responsible for setting up the account object, tearing it down, and
 *  setting up the driver correctly.
 */
var q = require("q");
var selenium_webdriver_1 = require("selenium-webdriver");
var logger_1 = require("../logger");
var driverProvider_1 = require("./driverProvider");
var http = require('selenium-webdriver/http');
var logger = new logger_1.Logger('useExistingWebDriver');
var UseExistingWebDriver = /** @class */ (function (_super) {
    __extends(UseExistingWebDriver, _super);
    function UseExistingWebDriver(config) {
        return _super.call(this, config) || this;
    }
    /**
     * Configure and launch (if applicable) the object's environment.
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    UseExistingWebDriver.prototype.setupDriverEnv = function () {
        var defer = q.defer();
        this.config_.seleniumWebDriver.getSession().then(function (session) {
            logger.info('Using session id - ' + session.getId());
            return defer.resolve();
        });
        return q(undefined);
    };
    /**
     * Getting a new driver by attaching an existing session.
     *
     * @public
     * @return {WebDriver} webdriver instance
     */
    UseExistingWebDriver.prototype.getNewDriver = function () {
        var newDriver = this.config_.seleniumWebDriver;
        this.drivers_.push(newDriver);
        return newDriver;
    };
    /**
     * Maintains the existing session and does not quit the driver.
     *
     * @public
     */
    UseExistingWebDriver.prototype.quitDriver = function () {
        return selenium_webdriver_1.promise.when(undefined);
    };
    return UseExistingWebDriver;
}(driverProvider_1.DriverProvider));
exports.UseExistingWebDriver = UseExistingWebDriver;
//# sourceMappingURL=useExistingWebDriver.js.map