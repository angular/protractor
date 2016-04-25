/*
 * This is an implementation of the SauceLabs Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var q = require('q');
var util = require('util');
var driverProvider_1 = require('./driverProvider');
var logger2_1 = require('../logger2');
var SauceLabs = require('saucelabs');
var logger = new logger2_1.Logger('sauce');
var Sauce = (function (_super) {
    __extends(Sauce, _super);
    function Sauce(config) {
        _super.call(this, config);
    }
    /**
     * Hook to update the sauce job.
     * @public
     * @param {Object} update
     * @return {q.promise} A promise that will resolve when the update is complete.
     */
    Sauce.prototype.updateJob = function (update) {
        var _this = this;
        var deferredArray = this.drivers_.map(function (driver) {
            var deferred = q.defer();
            driver.getSession().then(function (session) {
                logger.info('SauceLabs results available at http://saucelabs.com/jobs/' +
                    session.getId());
                _this.sauceServer_.updateJob(session.getId(), update, function (err) {
                    if (err) {
                        throw new Error('Error updating Sauce pass/fail status: ' + util.inspect(err));
                    }
                    deferred.resolve();
                });
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
    Sauce.prototype.setupEnv = function () {
        var deferred = q.defer();
        this.sauceServer_ = new SauceLabs({
            username: this.config_.sauceUser,
            password: this.config_.sauceKey,
            agent: this.config_.sauceAgent
        });
        this.config_.capabilities.username = this.config_.sauceUser;
        this.config_.capabilities.accessKey = this.config_.sauceKey;
        this.config_.capabilities.build = this.config_.sauceBuild;
        var auth = 'http://' + this.config_.sauceUser + ':' + this.config_.sauceKey + '@';
        this.config_.seleniumAddress =
            auth + (this.config_.sauceSeleniumAddress ?
                this.config_.sauceSeleniumAddress :
                'ondemand.saucelabs.com:80/wd/hub');
        // Append filename to capabilities.name so that it's easier to identify
        // tests.
        if (this.config_.capabilities.name &&
            this.config_.capabilities.shardTestFiles) {
            this.config_.capabilities.name +=
                (':' + this.config_.specs.toString().replace(/^.*[\\\/]/, ''));
        }
        logger.info('Using SauceLabs selenium server at ' +
            this.config_.seleniumAddress.replace(/\/\/.+@/, '//'));
        deferred.resolve();
        return deferred.promise;
    };
    return Sauce;
}(driverProvider_1.DriverProvider));
exports.Sauce = Sauce;
