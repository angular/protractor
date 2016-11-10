"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*
 *  This is an implementation of the Direct Driver Provider.
 *  It is responsible for setting up the account object, tearing
 *  it down, and setting up the driver correctly.
 */
var fs = require('fs');
var path = require('path');
var q = require('q');
var exitCodes_1 = require('../exitCodes');
var logger_1 = require('../logger');
var driverProvider_1 = require('./driverProvider');
var webdriver = require('selenium-webdriver'), chrome = require('selenium-webdriver/chrome'), firefox = require('selenium-webdriver/firefox');
var SeleniumConfig = require('webdriver-manager/built/lib/config').Config;
var SeleniumChrome = require('webdriver-manager/built/lib/binaries/chrome_driver').ChromeDriver;
var SeleniumStandAlone = require('webdriver-manager/built/lib/binaries/stand_alone').StandAlone;
var logger = new logger_1.Logger('direct');
var Direct = (function (_super) {
    __extends(Direct, _super);
    function Direct(config) {
        _super.call(this, config);
    }
    /**
     * Configure and launch (if applicable) the object's environment.
     * @public
     * @return {q.promise} A promise which will resolve when the environment is
     *     ready to test.
     */
    Direct.prototype.setupEnv = function () {
        switch (this.config_.capabilities.browserName) {
            case 'chrome':
                logger.info('Using ChromeDriver directly...');
                break;
            case 'firefox':
                logger.info('Using FirefoxDriver directly...');
                break;
            default:
                throw new exitCodes_1.BrowserError(logger, 'browserName ' + this.config_.capabilities.browserName +
                    ' is not supported with directConnect.');
        }
        return q.fcall(function () { });
    };
    /**
     * Create a new driver.
     *
     * @public
     * @override
     * @return webdriver instance
     */
    Direct.prototype.getNewDriver = function () {
        var driver;
        switch (this.config_.capabilities.browserName) {
            case 'chrome':
                var defaultChromeDriverPath = path.resolve(SeleniumConfig.getSeleniumDir(), new SeleniumChrome().executableFilename());
                if (process.platform.indexOf('win') === 0) {
                    defaultChromeDriverPath += '.exe';
                }
                var chromeDriverFile = this.config_.chromeDriver || defaultChromeDriverPath;
                if (!fs.existsSync(chromeDriverFile)) {
                    throw new exitCodes_1.BrowserError(logger, 'Could not find chromedriver at ' + chromeDriverFile);
                }
                var service = new chrome.ServiceBuilder(chromeDriverFile).build();
                driver = new chrome.Driver(new webdriver.Capabilities(this.config_.capabilities), service);
                break;
            case 'firefox':
                if (this.config_.firefoxPath) {
                    this.config_.capabilities['firefox_binary'] =
                        this.config_.firefoxPath;
                }
                driver = new firefox.Driver(this.config_.capabilities);
                break;
            default:
                throw new exitCodes_1.BrowserError(logger, 'browserName ' + this.config_.capabilities.browserName +
                    ' is not supported with directConnect.');
        }
        this.drivers_.push(driver);
        return driver;
    };
    return Direct;
}(driverProvider_1.DriverProvider));
exports.Direct = Direct;
