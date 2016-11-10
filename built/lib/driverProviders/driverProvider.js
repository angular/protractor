"use strict";
/**
 *  This is a base driver provider class.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
var q = require('q');
var webdriver = require('selenium-webdriver');
var DriverProvider = (function () {
    function DriverProvider(config) {
        this.config_ = config;
        this.drivers_ = [];
    }
    /**
     * Get all existing drivers.
     *
     * @public
     * @return array of webdriver instances
     */
    DriverProvider.prototype.getExistingDrivers = function () {
        return this.drivers_.slice(); // Create a shallow copy
    };
    /**
     * Create a new driver.
     *
     * @public
     * @return webdriver instance
     */
    DriverProvider.prototype.getNewDriver = function () {
        var builder = new webdriver.Builder()
            .usingServer(this.config_.seleniumAddress)
            .usingWebDriverProxy(this.config_.webDriverProxy)
            .withCapabilities(this.config_.capabilities);
        if (this.config_.disableEnvironmentOverrides === true) {
            builder.disableEnvironmentOverrides();
        }
        var newDriver = builder.build();
        this.drivers_.push(newDriver);
        return newDriver;
    };
    /**
     * Quit a driver.
     *
     * @public
     * @param webdriver instance
     */
    DriverProvider.prototype.quitDriver = function (driver) {
        var driverIndex = this.drivers_.indexOf(driver);
        if (driverIndex >= 0) {
            this.drivers_.splice(driverIndex, 1);
        }
        var deferred = q.defer();
        if (driver.getSession() === undefined) {
            deferred.resolve();
        }
        else {
            driver.getSession().then(function (session_) {
                if (session_) {
                    driver.quit().then(function () {
                        deferred.resolve();
                    });
                }
                else {
                    deferred.resolve();
                }
            });
        }
        return deferred.promise;
    };
    /**
     * Default update job method.
     * @return a promise
     */
    DriverProvider.prototype.updateJob = function (update) {
        return q.fcall(function () { });
    };
    ;
    /**
     * Default setup environment method.
     * @return a promise
     */
    DriverProvider.prototype.setupEnv = function () {
        return q.fcall(function () { });
    };
    ;
    /**
     * Teardown and destroy the environment and do any associated cleanup.
     * Shuts down the drivers.
     *
     * @public
     * @return {q.promise} A promise which will resolve when the environment
     *     is down.
     */
    DriverProvider.prototype.teardownEnv = function () {
        var _this = this;
        return q.all(this.drivers_.map(function (driver) {
            return _this.quitDriver(driver);
        }));
    };
    return DriverProvider;
}());
exports.DriverProvider = DriverProvider;
