"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 * This is an implementation of the Local Driver Provider.
 * It is responsible for setting up the account object, tearing
 * it down, and setting up the driver correctly.
 *
 * TODO - it would be nice to do this in the launcher phase,
 * so that we only start the local selenium once per entire launch.
 */
var fs = require('fs');
var path = require('path');
var q = require('q');
var exitCodes_1 = require('../exitCodes');
var logger_1 = require('../logger');
var driverProvider_1 = require('./driverProvider');
var SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
var SeleniumChrome = require('webdriver-manager/built/lib/binaries/chrome_driver').ChromeDriver;
var SeleniumStandAlone = require('webdriver-manager/built/lib/binaries/stand_alone').StandAlone;
var remote = require('selenium-webdriver/remote');
var logger = new logger_1.Logger('local');
var Local = (function (_super) {
    __extends(Local, _super);
    function Local(config) {
        _super.call(this, config);
        this.server_ = null;
    }
    /**
     * Helper to locate the default jar path if none is provided by the user.
     * @private
     */
    Local.prototype.addDefaultBinaryLocs_ = function () {
        if (!this.config_.seleniumServerJar) {
            logger.debug('Attempting to find the SeleniumServerJar in the default ' +
                'location used by webdriver-manager');
            this.config_.seleniumServerJar = path.resolve(SeleniumConfig.getSeleniumDir(), new SeleniumStandAlone().executableFilename());
        }
        if (!fs.existsSync(this.config_.seleniumServerJar)) {
            throw new exitCodes_1.BrowserError(logger, 'No selenium server jar found at the specified ' +
                'location (' + this.config_.seleniumServerJar +
                '). Check that the version number is up to date.');
        }
        if (this.config_.capabilities.browserName === 'chrome') {
            if (!this.config_.chromeDriver) {
                logger.debug('Attempting to find the chromedriver binary in the default ' +
                    'location used by webdriver-manager');
                this.config_.chromeDriver = path.resolve(SeleniumConfig.getSeleniumDir(), new SeleniumChrome().executableFilename());
            }
            // Check if file exists, if not try .exe or fail accordingly
            if (!fs.existsSync(this.config_.chromeDriver)) {
                if (fs.existsSync(this.config_.chromeDriver + '.exe')) {
                    this.config_.chromeDriver += '.exe';
                }
                else {
                    throw new exitCodes_1.BrowserError(logger, 'Could not find chromedriver at ' + this.config_.chromeDriver);
                }
            }
        }
    };
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    Local.prototype.setupEnv = function () {
        var _this = this;
        var deferred = q.defer();
        this.addDefaultBinaryLocs_();
        logger.info('Starting selenium standalone server...');
        var serverConf = this.config_.localSeleniumStandaloneOpts || {};
        // If args or port is not set use seleniumArgs and seleniumPort
        // for backward compatibility
        if (serverConf.args === undefined) {
            serverConf.args = this.config_.seleniumArgs || [];
        }
        if (serverConf.port === undefined) {
            serverConf.port = this.config_.seleniumPort;
        }
        // configure server
        if (this.config_.chromeDriver) {
            serverConf.args.push('-Dwebdriver.chrome.driver=' + this.config_.chromeDriver);
        }
        this.server_ =
            new remote.SeleniumServer(this.config_.seleniumServerJar, serverConf);
        // start local server, grab hosted address, and resolve promise
        this.server_.start().then(function (url) {
            logger.info('Selenium standalone server started at ' + url);
            _this.server_.address().then(function (address) {
                _this.config_.seleniumAddress = address;
                deferred.resolve();
            });
        });
        return deferred.promise;
    };
    /**
     * Teardown and destroy the environment and do any associated cleanup.
     * Shuts down the drivers and server.
     *
     * @public
     * @override
     * @return {q.promise} A promise which will resolve when the environment
     *     is down.
     */
    Local.prototype.teardownEnv = function () {
        var _this = this;
        var deferred = q.defer();
        _super.prototype.teardownEnv.call(this).then(function () {
            logger.info('Shutting down selenium standalone server.');
            _this.server_.stop().then(function () {
                deferred.resolve();
            });
        });
        return deferred.promise;
    };
    return Local;
}(driverProvider_1.DriverProvider));
exports.Local = Local;
