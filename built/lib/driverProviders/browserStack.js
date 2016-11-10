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
var https = require('https');
var q = require('q');
var util = require('util');
var exitCodes_1 = require('../exitCodes');
var logger_1 = require('../logger');
var driverProvider_1 = require('./driverProvider');
var logger = new logger_1.Logger('browserstack');
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
                var headers = {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' +
                        new Buffer(_this.config_.browserstackUser + ':' +
                            _this.config_.browserstackKey)
                            .toString('base64')
                };
                var options = {
                    hostname: 'www.browserstack.com',
                    port: 443,
                    path: '/automate/sessions/' + session.getId() + '.json',
                    method: 'GET',
                    headers: headers
                };
                var req = https.request(options, function (res) {
                    res.on('data', function (data) {
                        var info = JSON.parse(data.toString());
                        if (info && info.automation_session &&
                            info.automation_session.browser_url) {
                            logger.info('BrowserStack results available at ' +
                                info.automation_session.browser_url);
                        }
                        else {
                            logger.info('BrowserStack results available at ' +
                                'https://www.browserstack.com/automate');
                        }
                    });
                });
                req.end();
                req.on('error', function (e) {
                    logger.info('BrowserStack results available at ' +
                        'https://www.browserstack.com/automate');
                });
                var jobStatus = update.passed ? 'completed' : 'error';
                options.method = 'PUT';
                var update_req = https.request(options, function (res) {
                    var responseStr = '';
                    res.on('data', function (data) {
                        responseStr += data.toString();
                    });
                    res.on('end', function () {
                        logger.info(responseStr);
                        deferred.resolve();
                    });
                    res.on('error', function (e) {
                        throw new exitCodes_1.BrowserError(logger, 'Error updating BrowserStack pass/fail status: ' +
                            util.inspect(e));
                    });
                });
                update_req.write('{"status":"' + jobStatus + '"}');
                update_req.end();
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
