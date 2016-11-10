"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 *  This is an implementation of the Attach Session Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
var q = require('q');
var logger_1 = require('../logger');
var driverProvider_1 = require('./driverProvider');
var webdriver = require('selenium-webdriver');
var executors = require('selenium-webdriver/executors');
var logger = new logger_1.Logger('attachSession');
var AttachSession = (function (_super) {
    __extends(AttachSession, _super);
    function AttachSession(config) {
        _super.call(this, config);
    }
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    AttachSession.prototype.setupEnv = function () {
        logger.info('Using the selenium server at ' + this.config_.seleniumAddress);
        logger.info('Using session id - ' + this.config_.seleniumSessionId);
        return q(undefined);
    };
    /**
     * Getting a new driver by attaching an existing session.
     *
     * @public
     * @return {WebDriver} webdriver instance
     */
    AttachSession.prototype.getNewDriver = function () {
        var executor = executors.createExecutor(this.config_.seleniumAddress);
        var newDriver = webdriver.WebDriver.attachToSession(executor, this.config_.seleniumSessionId);
        this.drivers_.push(newDriver);
        return newDriver;
    };
    /**
     * Maintains the existing session and does not quit the driver.
     *
     * @public
     */
    AttachSession.prototype.quitDriver = function () {
        var defer = q.defer();
        defer.resolve(null);
        return defer.promise;
    };
    return AttachSession;
}(driverProvider_1.DriverProvider));
exports.AttachSession = AttachSession;
