"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var q = require('q');
var util = require('util');
var browser_1 = require('./browser');
var driverProviders_1 = require('./driverProviders');
var logger_1 = require('./logger');
var plugins_1 = require('./plugins');
var ptor_1 = require('./ptor');
var helper = require('./util');
var webdriver = require('selenium-webdriver');
var logger = new logger_1.Logger('runner');
/*
 * Runner is responsible for starting the execution of a test run and triggering
 * setup, teardown, managing config, etc through its various dependencies.
 *
 * The Protractor Runner is a node EventEmitter with the following events:
 * - testPass
 * - testFail
 * - testsDone
 *
 * @param {Object} config
 * @constructor
 */
var Runner = (function (_super) {
    __extends(Runner, _super);
    function Runner(config) {
        _super.call(this);
        /**
         * Responsible for cleaning up test run and exiting the process.
         * @private
         * @param {int} Standard unix exit code
         */
        this.exit_ = function (exitCode) {
            return helper
                .runFilenameOrFn_(this.config_.configDir, this.config_.onCleanUp, [exitCode])
                .then(function (returned) {
                if (typeof returned === 'number') {
                    return returned;
                }
                else {
                    return exitCode;
                }
            });
        };
        this.config_ = config;
        if (config.v8Debug) {
            // Call this private function instead of sending SIGUSR1 because Windows.
            process['_debugProcess'](process.pid);
        }
        if (config.nodeDebug) {
            process['_debugProcess'](process.pid);
            var flow = webdriver.promise.controlFlow();
            flow.execute(function () {
                var nodedebug = require('child_process').fork('debug', ['localhost:5858']);
                process.on('exit', function () {
                    nodedebug.kill('SIGTERM');
                });
                nodedebug.on('exit', function () {
                    process.exit(1);
                });
            }, 'start the node debugger');
            flow.timeout(1000, 'waiting for debugger to attach');
        }
        if (config.capabilities && config.capabilities.seleniumAddress) {
            config.seleniumAddress = config.capabilities.seleniumAddress;
        }
        this.loadDriverProvider_(config);
        this.setTestPreparer(config.onPrepare);
    }
    /**
     * Registrar for testPreparers - executed right before tests run.
     * @public
     * @param {string/Fn} filenameOrFn
     */
    Runner.prototype.setTestPreparer = function (filenameOrFn) {
        this.preparer_ = filenameOrFn;
    };
    /**
     * Executor of testPreparer
     * @public
     * @return {q.Promise} A promise that will resolve when the test preparers
     *     are finished.
     */
    Runner.prototype.runTestPreparer = function () {
        return helper.runFilenameOrFn_(this.config_.configDir, this.preparer_);
    };
    /**
     * Grab driver provider based on type
     * @private
     *
     * Priority
     * 1) if directConnect is true, use that
     * 2) if seleniumAddress is given, use that
     * 3) if a Sauce Labs account is given, use that
     * 4) if a seleniumServerJar is specified, use that
     * 5) try to find the seleniumServerJar in protractor/selenium
     */
    Runner.prototype.loadDriverProvider_ = function (config) {
        this.config_ = config;
        if (this.config_.directConnect) {
            this.driverprovider_ = new driverProviders_1.Direct(this.config_);
        }
        else if (this.config_.seleniumAddress) {
            if (this.config_.seleniumSessionId) {
                this.driverprovider_ = new driverProviders_1.AttachSession(this.config_);
            }
            else {
                this.driverprovider_ = new driverProviders_1.Hosted(this.config_);
            }
        }
        else if (this.config_.browserstackUser && this.config_.browserstackKey) {
            this.driverprovider_ = new driverProviders_1.BrowserStack(this.config_);
        }
        else if (this.config_.sauceUser && this.config_.sauceKey) {
            this.driverprovider_ = new driverProviders_1.Sauce(this.config_);
        }
        else if (this.config_.seleniumServerJar) {
            this.driverprovider_ = new driverProviders_1.Local(this.config_);
        }
        else if (this.config_.mockSelenium) {
            this.driverprovider_ = new driverProviders_1.Mock(this.config_);
        }
        else {
            this.driverprovider_ = new driverProviders_1.Local(this.config_);
        }
    };
    /**
     * Getter for the Runner config object
     * @public
     * @return {Object} config
     */
    Runner.prototype.getConfig = function () {
        return this.config_;
    };
    /**
     * Get the control flow used by this runner.
     * @return {Object} WebDriver control flow.
     */
    Runner.prototype.controlFlow = function () {
        return webdriver.promise.controlFlow();
    };
    /**
     * Sets up convenience globals for test specs
     * @private
     */
    Runner.prototype.setupGlobals_ = function (browser_) {
        // Keep $, $$, element, and by/By under the global protractor namespace
        ptor_1.protractor.browser = browser_;
        ptor_1.protractor.$ = browser_.$;
        ptor_1.protractor.$$ = browser_.$$;
        ptor_1.protractor.element = browser_.element;
        ptor_1.protractor.by = ptor_1.protractor.By = browser_1.Browser.By;
        ptor_1.protractor.wrapDriver = browser_1.Browser.wrapDriver;
        ptor_1.protractor.ExpectedConditions = browser_1.Browser.ExpectedConditions;
        if (!this.config_.noGlobals) {
            // Export protractor to the global namespace to be used in tests.
            global.browser = browser_;
            global.$ = browser_.$;
            global.$$ = browser_.$$;
            global.element = browser_.element;
            global.by = global.By = ptor_1.protractor.By;
            global.ExpectedConditions = ptor_1.protractor.ExpectedConditions;
        }
        global.protractor = ptor_1.protractor;
        if (!this.config_.skipSourceMapSupport) {
            // Enable sourcemap support for stack traces.
            require('source-map-support').install();
        }
        // Required by dart2js machinery.
        // https://code.google.com/p/dart/source/browse/branches/bleeding_edge/dart/sdk/lib/js/dart2js/js_dart2js.dart?spec=svn32943&r=32943#487
        global.DartObject = function (o) {
            this.o = o;
        };
    };
    /**
     * Create a new driver from a driverProvider. Then set up a
     * new protractor instance using this driver.
     * This is used to set up the initial protractor instances and any
     * future ones.
     *
     * @param {?Plugin} The plugin functions
     *
     * @return {Protractor} a protractor instance.
     * @public
     */
    Runner.prototype.createBrowser = function (plugins) {
        var _this = this;
        var config = this.config_;
        var driver = this.driverprovider_.getNewDriver();
        var browser_ = browser_1.Browser.wrapDriver(driver, config.baseUrl, config.rootElement, config.untrackOutstandingTimeouts);
        browser_.params = config.params;
        if (plugins) {
            browser_.plugins_ = plugins;
        }
        if (config.getPageTimeout) {
            browser_.getPageTimeout = config.getPageTimeout;
        }
        if (config.allScriptsTimeout) {
            browser_.allScriptsTimeout = config.allScriptsTimeout;
        }
        if (config.debuggerServerPort) {
            browser_.debuggerServerPort_ = config.debuggerServerPort;
        }
        if (config.useAllAngular2AppRoots) {
            browser_.useAllAngular2AppRoots();
        }
        browser_.ready =
            driver.manage().timeouts().setScriptTimeout(config.allScriptsTimeout);
        browser_.getProcessedConfig = function () {
            return webdriver.promise.fulfilled(config);
        };
        browser_.forkNewDriverInstance =
            function (opt_useSameUrl, opt_copyMockModules) {
                var newBrowser = _this.createBrowser(plugins);
                if (opt_copyMockModules) {
                    newBrowser.mockModules_ = browser_.mockModules_;
                }
                if (opt_useSameUrl) {
                    browser_.driver.getCurrentUrl().then(function (url) {
                        newBrowser.get(url);
                    });
                }
                return newBrowser;
            };
        browser_.restart = function () {
            // Note: because tests are not paused at this point, any async
            // calls here are not guaranteed to complete before the tests resume.
            _this.driverprovider_.quitDriver(browser_.driver);
            // Copy mock modules, but do not navigate to previous URL.
            browser_ = browser_.forkNewDriverInstance(false, true);
            _this.setupGlobals_(browser_);
        };
        return browser_;
    };
    /**
     * Final cleanup on exiting the runner.
     *
     * @return {q.Promise} A promise which resolves on finish.
     * @private
     */
    Runner.prototype.shutdown_ = function () {
        var _this = this;
        return q.all(this.driverprovider_.getExistingDrivers().map(function (webdriver) {
            return _this.driverprovider_.quitDriver(webdriver);
        }));
    };
    /**
     * The primary workhorse interface. Kicks off the test running process.
     *
     * @return {q.Promise} A promise which resolves to the exit code of the tests.
     * @public
     */
    Runner.prototype.run = function () {
        var _this = this;
        var testPassed;
        var plugins = new plugins_1.Plugins(this.config_);
        var pluginPostTestPromises;
        var browser_;
        var results;
        if (this.config_.framework !== 'explorer' && !this.config_.specs.length) {
            throw new Error('Spec patterns did not match any files.');
        }
        // 1) Setup environment
        // noinspection JSValidateTypes
        return this.driverprovider_.setupEnv()
            .then(function () {
            // 2) Create a browser and setup globals
            browser_ = _this.createBrowser(plugins);
            _this.setupGlobals_(browser_);
            return browser_.ready.then(browser_.getSession)
                .then(function (session) {
                logger.debug('WebDriver session successfully started with capabilities ' +
                    util.inspect(session.getCapabilities()));
            }, function (err) {
                logger.error('Unable to start a WebDriver session.');
                throw err;
            });
            // 3) Setup plugins
        })
            .then(function () {
            return plugins.setup();
            // 4) Execute test cases
        })
            .then(function () {
            // Do the framework setup here so that jasmine and mocha globals are
            // available to the onPrepare function.
            var frameworkPath = '';
            if (_this.config_.framework === 'jasmine' ||
                _this.config_.framework === 'jasmine2') {
                frameworkPath = './frameworks/jasmine.js';
            }
            else if (_this.config_.framework === 'mocha') {
                frameworkPath = './frameworks/mocha.js';
            }
            else if (_this.config_.framework === 'debugprint') {
                // Private framework. Do not use.
                frameworkPath = './frameworks/debugprint.js';
            }
            else if (_this.config_.framework === 'explorer') {
                // Private framework. Do not use.
                frameworkPath = './frameworks/explorer.js';
            }
            else if (_this.config_.framework === 'custom') {
                if (!_this.config_.frameworkPath) {
                    throw new Error('When config.framework is custom, ' +
                        'config.frameworkPath is required.');
                }
                frameworkPath = _this.config_.frameworkPath;
            }
            else {
                throw new Error('config.framework (' + _this.config_.framework +
                    ') is not a valid framework.');
            }
            if (_this.config_.restartBrowserBetweenTests) {
                var restartDriver = function () {
                    browser_.restart();
                };
                _this.on('testPass', restartDriver);
                _this.on('testFail', restartDriver);
            }
            // We need to save these promises to make sure they're run, but we
            // don't
            // want to delay starting the next test (because we can't, it's just
            // an event emitter).
            pluginPostTestPromises = [];
            _this.on('testPass', function (testInfo) {
                pluginPostTestPromises.push(plugins.postTest(true, testInfo));
            });
            _this.on('testFail', function (testInfo) {
                pluginPostTestPromises.push(plugins.postTest(false, testInfo));
            });
            logger.debug('Running with spec files ' + _this.config_.specs);
            return require(frameworkPath).run(_this, _this.config_.specs);
            // 5) Wait for postTest plugins to finish
        })
            .then(function (testResults) {
            results = testResults;
            return q.all(pluginPostTestPromises);
            // 6) Teardown plugins
        })
            .then(function () {
            return plugins.teardown();
            // 7) Teardown
        })
            .then(function () {
            results = helper.joinTestLogs(results, plugins.getResults());
            _this.emit('testsDone', results);
            testPassed = results.failedCount === 0;
            if (_this.driverprovider_.updateJob) {
                return _this.driverprovider_.updateJob({ 'passed': testPassed })
                    .then(function () {
                    return _this.driverprovider_.teardownEnv();
                });
            }
            else {
                return _this.driverprovider_.teardownEnv();
            }
            // 8) Let plugins do final cleanup
        })
            .then(function () {
            return plugins.postResults();
            // 9) Exit process
        })
            .then(function () {
            var exitCode = testPassed ? 0 : 1;
            return _this.exit_(exitCode);
        })
            .fin(function () {
            return _this.shutdown_();
        });
    };
    return Runner;
}(events_1.EventEmitter));
exports.Runner = Runner;
