"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * This is an implementation of the Browserstack Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
var request = require('request');
var q = require('q');
var util = require('util');
var driverProvider_1 = require('./driverProvider');
var logger2_1 = require('../logger2');
var logger = new logger2_1.Logger('browserstack');
var BrowserStack = (function (_super) {
    __extends(BrowserStack, _super);
    function BrowserStack(config) {
        _super.call(this, config);
    }
    /**
     * Hook to update the BrowserStack job status.
     * @public
     * @param {Object} update
     * @return {q.promise} A promise that will resolve when the update is complete.
     */
    BrowserStack.prototype.updateJob = function (update) {
        var _this = this;
        var deferredArray = this.drivers_.map(function (driver) {
            var deferred = q.defer();
            driver.getSession().then(function (session) {
                var jobStatus = update.passed ? 'completed' : 'error';
                logger.info('BrowserStack results available at ' +
                    'https://www.browserstack.com/automate');
                request({
                    url: 'https://www.browserstack.com/automate/sessions/' +
                        session.getId() + '.json',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic ' +
                            new Buffer(_this.config_.browserstackUser + ':' +
                                _this.config_.browserstackKey)
                                .toString('base64')
                    },
                    method: 'PUT',
                    form: { 'status': jobStatus }
                }, function (error) {
                    if (error) {
                        throw new Error('Error updating BrowserStack pass/fail status: ' +
                            util.inspect(error));
                    }
                });
                deferred.resolve();
            });
            return deferred.promise;
        });
        return q.all(deferredArray);
    };
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    BrowserStack.prototype.setupEnv = function () {
        var deferred = q.defer();
        this.config_.capabilities['browserstack.user'] =
            this.config_.browserstackUser;
        this.config_.capabilities['browserstack.key'] =
            this.config_.browserstackKey;
        this.config_.seleniumAddress = 'http://hub.browserstack.com/wd/hub';
        // Append filename to capabilities.name so that it's easier to identify
        // tests.
        if (this.config_.capabilities.name &&
            this.config_.capabilities.shardTestFiles) {
            this.config_.capabilities.name +=
                (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
        }
        logger.info('Using BrowserStack selenium server at ' +
            this.config_.seleniumAddress);
        deferred.resolve();
        return deferred.promise;
    };
    return BrowserStack;
}(driverProvider_1.DriverProvider));
exports.BrowserStack = BrowserStack;
