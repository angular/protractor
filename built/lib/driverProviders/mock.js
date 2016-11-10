"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * This is an mock implementation of the Driver Provider.
 * It returns a fake webdriver and never actually contacts a selenium
 * server.
 */
var q = require('q');
var driverProvider_1 = require('./driverProvider');
var webdriver = require('selenium-webdriver');
var Mock = (function (_super) {
    __extends(Mock, _super);
    function Mock(config) {
        _super.call(this, config);
    }
    /**
     * An execute function that returns a promise with a test value.
     */
    Mock.prototype.execute = function () {
        var deferred = q.defer();
        deferred.resolve({ value: 'test_response' });
        return deferred.promise;
    };
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve immediately.
     */
    Mock.prototype.setupEnv = function () {
        return q.fcall(function () { });
    };
    /**
     * Create a new driver.
     *
     * @public
     * @override
     * @return webdriver instance
     */
    Mock.prototype.getNewDriver = function () {
        var mockSession = new webdriver.Session('test_session_id', {});
        var newDriver = new webdriver.WebDriver(mockSession, new Mock());
        this.drivers_.push(newDriver);
        return newDriver;
    };
    return Mock;
}(driverProvider_1.DriverProvider));
exports.Mock = Mock;
