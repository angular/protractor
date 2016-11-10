"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// Util from NodeJs
var net = require('net');
var url = require('url');
var util = require('util');
var element_1 = require('./element');
var expectedConditions_1 = require('./expectedConditions');
var locators_1 = require('./locators');
var logger_1 = require('./logger');
var plugins_1 = require('./plugins');
var helper = require('./util');
var clientSideScripts = require('./clientsidescripts');
var webdriver = require('selenium-webdriver');
var Command = require('selenium-webdriver/lib/command').Command;
var CommandName = require('selenium-webdriver/lib/command').Name;
// jshint browser: true
/* global angular */
var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';
var DEFAULT_RESET_URL = 'data:text/html,<html></html>';
var DEFAULT_GET_PAGE_TIMEOUT = 10000;
var logger = new logger_1.Logger('protractor');
/*
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (var foo in webdriver) {
    exports[foo] = webdriver[foo];
}
// Explicitly define webdriver.WebDriver.
var Webdriver = (function () {
    function Webdriver() {
        this.actions = webdriver.WebDriver.actions;
        this.wait = webdriver.WebDriver.wait;
        this.sleep = webdriver.WebDriver.sleep;
        this.getCurrentUrl = webdriver.WebDriver.getCurrentUrl;
        this.getTitle = webdriver.WebDriver.getTitle;
        this.takeScreenshot = webdriver.WebDriver.takeScreenshot;
    }
    return Webdriver;
}());
exports.Webdriver = Webdriver;
/**
 * Mix a function from one object onto another. The function will still be
 * called in the context of the original object.
 *
 * @private
 * @param {Object} to
 * @param {Object} from
 * @param {string} fnName
 * @param {function=} setupFn
 */
function mixin(to, from, fnName, setupFn) {
    to[fnName] = function () {
        if (setupFn) {
            setupFn();
        }
        return from[fnName].apply(from, arguments);
    };
}
;
/**
 * Build the helper 'element' function for a given instance of Browser.
 *
 * @private
 * @param {Browser} browser A browser instance.
 * @returns {function(webdriver.Locator): ElementFinder}
 */
function buildElementHelper(browser) {
    var element = function (locator) {
        return new element_1.ElementArrayFinder(browser).all(locator).toElementFinder_();
    };
    element.all =
        function (locator) {
            return new element_1.ElementArrayFinder(browser).all(locator);
        };
    return element;
}
;
/**
 * @alias browser
 * @constructor
 * @extends {webdriver.WebDriver}
 * @param {webdriver.WebDriver} webdriver
 * @param {string=} opt_baseUrl A base URL to run get requests against.
 * @param {string=} opt_rootElement  Selector element that has an ng-app in
 *     scope.
 * @param {boolean=} opt_untrackOutstandingTimeouts Whether Protractor should
 *     stop tracking outstanding $timeouts.
 */
var Browser = (function (_super) {
    __extends(Browser, _super);
    function Browser(webdriverInstance, opt_baseUrl, opt_rootElement, opt_untrackOutstandingTimeouts) {
        var _this = this;
        _super.call(this);
        // These functions should delegate to the webdriver instance, but should
        // wait for Angular to sync up before performing the action. This does not
        // include functions which are overridden by protractor below.
        var methodsToSync = ['getCurrentUrl', 'getPageSource', 'getTitle'];
        // Mix all other driver functionality into Protractor.
        Object.getOwnPropertyNames(webdriver.WebDriver.prototype)
            .forEach(function (method) {
            if (!_this[method] && typeof webdriverInstance[method] == 'function') {
                if (methodsToSync.indexOf(method) !== -1) {
                    mixin(_this, webdriverInstance, method, _this.waitForAngular.bind(_this));
                }
                else {
                    mixin(_this, webdriverInstance, method);
                }
            }
        });
        this.driver = webdriverInstance;
        this.element = buildElementHelper(this);
        this.$ = element_1.build$(this.element, webdriver.By);
        this.$$ = element_1.build$$(this.element, webdriver.By);
        this.baseUrl = opt_baseUrl || '';
        this.rootEl = opt_rootElement || 'body';
        this.ignoreSynchronization = false;
        this.getPageTimeout = DEFAULT_GET_PAGE_TIMEOUT;
        this.params = {};
        this.ready = null;
        this.plugins_ = new plugins_1.Plugins({});
        this.resetUrl = DEFAULT_RESET_URL;
        this.ng12Hybrid = false;
        this.driver.getCapabilities().then(function (caps) {
            // Internet Explorer does not accept data URLs, which are the default
            // reset URL for Protractor.
            // Safari accepts data urls, but SafariDriver fails after one is used.
            // PhantomJS produces a "Detected a page unload event" if we use data urls
            var browserName = caps.get('browserName');
            if (browserName === 'internet explorer' || browserName === 'safari' ||
                browserName === 'phantomjs' || browserName === 'MicrosoftEdge') {
                _this.resetUrl = 'about:blank';
            }
        });
        this.trackOutstandingTimeouts_ = !opt_untrackOutstandingTimeouts;
        this.mockModules_ = [];
        this.addBaseMockModules_();
    }
    /**
     * Get the processed configuration object that is currently being run. This
     * will contain the specs and capabilities properties of the current runner
     * instance.
     *
     * Set by the runner.
     *
     * @returns {webdriver.promise.Promise} A promise which resolves to the
     * capabilities object.
     */
    Browser.prototype.getProcessedConfig = function () {
        return null;
    };
    /**
     * Fork another instance of browser for use in interactive tests.
     *
     * Set by the runner.
     *
     * @param {boolean} opt_useSameUrl Whether to navigate to current url on
     * creation
     * @param {boolean} opt_copyMockModules Whether to apply same mock modules on
     * creation
     * @returns {Browser} A browser instance.
     */
    Browser.prototype.forkNewDriverInstance = function (opt_useSameUrl, opt_copyMockModules) {
        return null;
    };
    /**
     * Restart the browser instance.
     *
     * Set by the runner.
     */
    Browser.prototype.restart = function () {
        return;
    };
    /**
     * Instead of using a single root element, search through all angular apps
     * available on the page when finding elements or waiting for stability.
     * Only compatible with Angular2.
     */
    Browser.prototype.useAllAngular2AppRoots = function () {
        // The empty string is an invalid css selector, so we use it to easily
        // signal to scripts to not find a root element.
        this.rootEl = '';
    };
    /**
     * The same as {@code webdriver.WebDriver.prototype.executeScript},
     * but with a customized description for debugging.
     *
     * @private
     * @param {!(string|Function)} script The script to execute.
     * @param {string} description A description of the command for debugging.
     * @param {...*} var_args The arguments to pass to the script.
     * @returns {!webdriver.promise.Promise.<T>} A promise that will resolve to
     * the
     *    scripts return value.
     * @template T
     */
    Browser.prototype.executeScript_ = function (script, description) {
        var scriptArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            scriptArgs[_i - 2] = arguments[_i];
        }
        if (typeof script === 'function') {
            script = 'return (' + script + ').apply(null, arguments);';
        }
        return this.driver.schedule(new Command(CommandName.EXECUTE_SCRIPT)
            .setParameter('script', script)
            .setParameter('args', scriptArgs), description);
    };
    /**
     * The same as {@code webdriver.WebDriver.prototype.executeAsyncScript},
     * but with a customized description for debugging.
     *
     * @private
     * @param {!(string|Function)} script The script to execute.
     * @param {string} description A description for debugging purposes.
     * @param {...*} var_args The arguments to pass to the script.
     * @returns {!webdriver.promise.Promise.<T>} A promise that will resolve to
     * the
     *    scripts return value.
     * @template T
     */
    Browser.prototype.executeAsyncScript_ = function (script, description) {
        var scriptArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            scriptArgs[_i - 2] = arguments[_i];
        }
        if (typeof script === 'function') {
            script = 'return (' + script + ').apply(null, arguments);';
        }
        return this.driver.schedule(new Command(CommandName.EXECUTE_ASYNC_SCRIPT)
            .setParameter('script', script)
            .setParameter('args', scriptArgs), description);
    };
    /**
     * Instruct webdriver to wait until Angular has finished rendering and has
     * no outstanding $http or $timeout calls before continuing.
     * Note that Protractor automatically applies this command before every
     * WebDriver action.
     *
     * @param {string=} opt_description An optional description to be added
     *     to webdriver logs.
     * @returns {!webdriver.promise.Promise} A promise that will resolve to the
     *    scripts return value.
     */
    Browser.prototype.waitForAngular = function (opt_description) {
        var _this = this;
        var description = opt_description ? ' - ' + opt_description : '';
        if (this.ignoreSynchronization) {
            return this.driver.controlFlow().execute(function () {
                return true;
            }, 'Ignore Synchronization Protractor.waitForAngular()');
        }
        var runWaitForAngularScript = function () {
            if (_this.plugins_.skipAngularStability()) {
                return webdriver.promise.fulfilled();
            }
            else if (_this.rootEl) {
                return _this.executeAsyncScript_(clientSideScripts.waitForAngular, 'Protractor.waitForAngular()' + description, _this.rootEl, _this.ng12Hybrid);
            }
            else {
                return _this.executeAsyncScript_(clientSideScripts.waitForAllAngular2, 'Protractor.waitForAngular()' + description);
            }
        };
        return runWaitForAngularScript()
            .then(function (browserErr) {
            if (browserErr) {
                throw 'Error while waiting for Protractor to ' +
                    'sync with the page: ' + JSON.stringify(browserErr);
            }
        })
            .then(function () {
            return _this.driver.controlFlow()
                .execute(function () {
                return _this.plugins_.waitForPromise();
            }, 'Plugins.waitForPromise()')
                .then(function () {
                return _this.driver.wait(function () {
                    return _this.plugins_.waitForCondition().then(function (results) {
                        return results.reduce(function (x, y) {
                            return x && y;
                        }, true);
                    });
                }, _this.allScriptsTimeout, 'Plugins.waitForCondition()');
            });
        }, function (err) {
            var timeout;
            if (/asynchronous script timeout/.test(err.message)) {
                // Timeout on Chrome
                timeout = /-?[\d\.]*\ seconds/.exec(err.message);
            }
            else if (/Timed out waiting for async script/.test(err.message)) {
                // Timeout on Firefox
                timeout = /-?[\d\.]*ms/.exec(err.message);
            }
            else if (/Timed out waiting for an asynchronous script/.test(err.message)) {
                // Timeout on Safari
                timeout = /-?[\d\.]*\ ms/.exec(err.message);
            }
            if (timeout) {
                var errMsg_1 = 'Timed out waiting for Protractor to synchronize with ' +
                    'the page after ' + timeout + '. Please see ' +
                    'https://github.com/angular/protractor/blob/master/docs/faq.md';
                if (description.startsWith(' - Locator: ')) {
                    errMsg_1 +=
                        '\nWhile waiting for element with locator' + description;
                }
                var pendingTimeoutsPromise = void 0;
                if (_this.trackOutstandingTimeouts_) {
                    pendingTimeoutsPromise = _this.executeScript_('return window.NG_PENDING_TIMEOUTS', 'Protractor.waitForAngular() - getting pending timeouts' +
                        description);
                }
                else {
                    pendingTimeoutsPromise = webdriver.promise.fulfilled({});
                }
                var pendingHttpsPromise = _this.executeScript_(clientSideScripts.getPendingHttpRequests, 'Protractor.waitForAngular() - getting pending https' +
                    description, _this.rootEl);
                return webdriver.promise
                    .all([pendingTimeoutsPromise, pendingHttpsPromise])
                    .then(function (arr) {
                    var pendingTimeouts = arr[0] || [];
                    var pendingHttps = arr[1] || [];
                    var key, pendingTasks = [];
                    for (key in pendingTimeouts) {
                        if (pendingTimeouts.hasOwnProperty(key)) {
                            pendingTasks.push(' - $timeout: ' + pendingTimeouts[key]);
                        }
                    }
                    for (key in pendingHttps) {
                        pendingTasks.push(' - $http: ' + pendingHttps[key].url);
                    }
                    if (pendingTasks.length) {
                        errMsg_1 += '. \nThe following tasks were pending:\n';
                        errMsg_1 += pendingTasks.join('\n');
                    }
                    err.message = errMsg_1;
                    throw err;
                }, function () {
                    err.message = errMsg_1;
                    throw err;
                });
            }
            else {
                throw err;
            }
        });
    };
    /**
     * Waits for Angular to finish rendering before searching for elements.
     * @see webdriver.WebDriver.findElement
     * @returns {!webdriver.promise.Promise} A promise that will be resolved to
     *      the located {@link webdriver.WebElement}.
     */
    Browser.prototype.findElement = function (locator) {
        return this.element(locator).getWebElement();
    };
    /**
     * Waits for Angular to finish rendering before searching for elements.
     * @see webdriver.WebDriver.findElements
     * @returns {!webdriver.promise.Promise} A promise that will be resolved to an
     *     array of the located {@link webdriver.WebElement}s.
     */
    Browser.prototype.findElements = function (locator) {
        return this.element.all(locator).getWebElements();
    };
    /**
     * Tests if an element is present on the page.
     * @see webdriver.WebDriver.isElementPresent
     * @returns {!webdriver.promise.Promise} A promise that will resolve to whether
     *     the element is present on the page.
     */
    Browser.prototype.isElementPresent = function (locatorOrElement) {
        var element = (locatorOrElement.isPresent) ? locatorOrElement :
            this.element(locatorOrElement);
        return element.isPresent();
    };
    /**
     * Add a module to load before Angular whenever Protractor.get is called.
     * Modules will be registered after existing modules already on the page,
     * so any module registered here will override preexisting modules with the
     * same
     * name.
     *
     * @example
     * browser.addMockModule('modName', function() {
     *   angular.module('modName', []).value('foo', 'bar');
     * });
     *
     * @param {!string} name The name of the module to load or override.
     * @param {!string|Function} script The JavaScript to load the module.
     *     Note that this will be executed in the browser context, so it cannot
     *     access variables from outside its scope.
     * @param {...*} varArgs Any additional arguments will be provided to
     *     the script and may be referenced using the `arguments` object.
     */
    Browser.prototype.addMockModule = function (name, script) {
        var moduleArgs = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            moduleArgs[_i - 2] = arguments[_i];
        }
        this.mockModules_.push({ name: name, script: script, args: moduleArgs });
    };
    /**
     * Clear the list of registered mock modules.
     */
    Browser.prototype.clearMockModules = function () {
        this.mockModules_ = [];
        this.addBaseMockModules_();
    };
    /**
     * Remove a registered mock module.
     *
     * @example
     * browser.removeMockModule('modName');
     *
     * @param {!string} name The name of the module to remove.
     */
    Browser.prototype.removeMockModule = function (name) {
        for (var i = 0; i < this.mockModules_.length; ++i) {
            if (this.mockModules_[i].name == name) {
                this.mockModules_.splice(i--, 1);
            }
        }
    };
    /**
     * Get a list of the current mock modules.
     *
     * @returns {Array.<!string|Function>} The list of mock modules.
     */
    Browser.prototype.getRegisteredMockModules = function () {
        return this.mockModules_.map(function (module) {
            return module.script;
        });
    };
    ;
    /**
     * Add the base mock modules used for all Protractor tests.
     *
     * @private
     */
    Browser.prototype.addBaseMockModules_ = function () {
        this.addMockModule('protractorBaseModule_', function (trackOutstandingTimeouts) {
            var ngMod = angular.module('protractorBaseModule_', []).config([
                '$compileProvider',
                function ($compileProvider) {
                    if ($compileProvider.debugInfoEnabled) {
                        $compileProvider.debugInfoEnabled(true);
                    }
                }
            ]);
            if (trackOutstandingTimeouts) {
                ngMod.config([
                    '$provide',
                    function ($provide) {
                        $provide.decorator('$timeout', [
                            '$delegate',
                            function ($delegate) {
                                var $timeout = $delegate;
                                var taskId = 0;
                                if (!window['NG_PENDING_TIMEOUTS']) {
                                    window['NG_PENDING_TIMEOUTS'] = {};
                                }
                                var extendedTimeout = function () {
                                    var args = Array.prototype.slice.call(arguments);
                                    if (typeof (args[0]) !== 'function') {
                                        return $timeout.apply(null, args);
                                    }
                                    taskId++;
                                    var fn = args[0];
                                    window['NG_PENDING_TIMEOUTS'][taskId] = fn.toString();
                                    var wrappedFn = (function (taskId_) {
                                        return function () {
                                            delete window['NG_PENDING_TIMEOUTS'][taskId_];
                                            return fn.apply(null, arguments);
                                        };
                                    })(taskId);
                                    args[0] = wrappedFn;
                                    var promise = $timeout.apply(null, args);
                                    promise.ptorTaskId_ = taskId;
                                    return promise;
                                };
                                extendedTimeout.cancel = function () {
                                    var taskId_ = arguments[0] && arguments[0].ptorTaskId_;
                                    if (taskId_) {
                                        delete window['NG_PENDING_TIMEOUTS'][taskId_];
                                    }
                                    return $timeout.cancel.apply($timeout, arguments);
                                };
                                return extendedTimeout;
                            }
                        ]);
                    }
                ]);
            }
        }, this.trackOutstandingTimeouts_);
    };
    /**
     * @see webdriver.WebDriver.get
     *
     * Navigate to the given destination and loads mock modules before
     * Angular. Assumes that the page being loaded uses Angular.
     * If you need to access a page which does not have Angular on load, use
     * the wrapped webdriver directly.
     *
     * @example
     * browser.get('https://angularjs.org/');
     * expect(browser.getCurrentUrl()).toBe('https://angularjs.org/');
     *
     * @param {string} destination Destination URL.
     * @param {number=} opt_timeout Number of milliseconds to wait for Angular to
     *     start.
     */
    Browser.prototype.get = function (destination, opt_timeout) {
        var _this = this;
        var timeout = opt_timeout ? opt_timeout : this.getPageTimeout;
        destination = this.baseUrl.indexOf('file://') === 0 ?
            this.baseUrl + destination :
            url.resolve(this.baseUrl, destination);
        var msg = function (str) {
            return 'Protractor.get(' + destination + ') - ' + str;
        };
        if (this.ignoreSynchronization) {
            this.driver.get(destination);
            return this.driver.controlFlow().execute(function () {
                return _this.plugins_.onPageLoad();
            });
        }
        var deferred = webdriver.promise.defer();
        this.driver.get(this.resetUrl).then(null, deferred.reject);
        this.executeScript_('window.name = "' + DEFER_LABEL + '" + window.name;' +
            'window.location.replace("' + destination + '");', msg('reset url'))
            .then(null, deferred.reject);
        // We need to make sure the new url has loaded before
        // we try to execute any asynchronous scripts.
        this.driver
            .wait(function () {
            return _this
                .executeScript_('return window.location.href;', msg('get url'))
                .then(function (url) {
                return url !== _this.resetUrl;
            }, function (err) {
                if (err.code == 13) {
                    // Ignore the error, and continue trying. This is
                    // because IE
                    // driver sometimes (~1%) will throw an unknown error
                    // from this
                    // execution. See
                    // https://github.com/angular/protractor/issues/841
                    // This shouldn't mask errors because it will fail
                    // with the timeout
                    // anyway.
                    return false;
                }
                else {
                    throw err;
                }
            });
        }, timeout, 'waiting for page to load for ' + timeout + 'ms')
            .then(null, deferred.reject);
        this.driver.controlFlow().execute(function () {
            return _this.plugins_.onPageLoad();
        });
        // Make sure the page is an Angular page.
        this.executeAsyncScript_(clientSideScripts.testForAngular, msg('test for angular'), Math.floor(timeout / 1000), this.ng12Hybrid)
            .then(function (angularTestResult) {
            var angularVersion = angularTestResult.ver;
            if (!angularVersion) {
                var message = angularTestResult.message;
                throw new Error('Angular could not be found on the page ' + destination +
                    ' : ' + message);
            }
            return angularVersion;
        }, function (err) {
            throw 'Error while running testForAngular: ' + err.message;
        })
            .then(loadMocks, deferred.reject);
        var self = this;
        function loadMocks(angularVersion) {
            if (angularVersion === 1) {
                // At this point, Angular will pause for us until
                // angular.resumeBootstrap
                // is called.
                var moduleNames = [];
                var _loop_1 = function(i) {
                    var mockModule = self.mockModules_[i];
                    var name_1 = mockModule.name;
                    moduleNames.push(name_1);
                    var executeScriptArgs = [
                        mockModule.script, msg('add mock module ' + name_1)
                    ].concat(mockModule.args);
                    self.executeScript_.apply(self, executeScriptArgs)
                        .then(null, function (err) {
                        throw 'Error while running module script ' + name_1 + ': ' +
                            err.message;
                    })
                        .then(null, deferred.reject);
                };
                for (var i = 0; i < self.mockModules_.length; ++i) {
                    _loop_1(i);
                }
                self.executeScript_('angular.resumeBootstrap(arguments[0]);', msg('resume bootstrap'), moduleNames)
                    .then(null, deferred.reject);
            }
            else {
                // TODO: support mock modules in Angular2. For now, error if someone
                // has tried to use one.
                if (self.mockModules_.length > 1) {
                    deferred.reject('Trying to load mock modules on an Angular2 app ' +
                        'is not yet supported.');
                }
            }
        }
        this.driver.controlFlow().execute(function () {
            return self.plugins_.onPageStable().then(function () {
                deferred.fulfill();
            }, function (error) {
                deferred.reject(error);
            });
        });
        return deferred.promise;
    };
    /**
     * @see webdriver.WebDriver.refresh
     *
     * Makes a full reload of the current page and loads mock modules before
     * Angular. Assumes that the page being loaded uses Angular.
     * If you need to access a page which does not have Angular on load, use
     * the wrapped webdriver directly.
     *
     * @param {number=} opt_timeout Number of milliseconds to wait for Angular to start.
     */
    Browser.prototype.refresh = function (opt_timeout) {
        var _this = this;
        if (this.ignoreSynchronization) {
            return this.driver.navigate().refresh();
        }
        return this
            .executeScript_('return window.location.href', 'Protractor.refresh() - getUrl')
            .then(function (href) {
            return _this.get(href, opt_timeout);
        });
    };
    /**
     * Mixin navigation methods back into the navigation object so that
     * they are invoked as before, i.e. driver.navigate().refresh()
     */
    Browser.prototype.navigate = function () {
        var nav = this.driver.navigate();
        mixin(nav, this, 'refresh');
        return nav;
    };
    /**
     * Browse to another page using in-page navigation.
     *
     * @example
     * browser.get('http://angular.github.io/protractor/#/tutorial');
     * browser.setLocation('api');
     * expect(browser.getCurrentUrl())
     *     .toBe('http://angular.github.io/protractor/#/api');
     *
     * @param {string} url In page URL using the same syntax as $location.url()
     * @returns {!webdriver.promise.Promise} A promise that will resolve once
     *    page has been changed.
     */
    Browser.prototype.setLocation = function (url) {
        this.waitForAngular();
        return this
            .executeScript_(clientSideScripts.setLocation, 'Protractor.setLocation()', this.rootEl, url)
            .then(function (browserErr) {
            if (browserErr) {
                throw 'Error while navigating to \'' + url + '\' : ' +
                    JSON.stringify(browserErr);
            }
        });
    };
    /**
     * Returns the current absolute url from AngularJS.
     *
     * @example
     * browser.get('http://angular.github.io/protractor/#/api');
     * expect(browser.getLocationAbsUrl())
     *     .toBe('http://angular.github.io/protractor/#/api');
     * @returns {string} The current absolute url from AngularJS.
     */
    Browser.prototype.getLocationAbsUrl = function () {
        this.waitForAngular();
        return this.executeScript_(clientSideScripts.getLocationAbsUrl, 'Protractor.getLocationAbsUrl()', this.rootEl);
    };
    /**
     * Adds a task to the control flow to pause the test and inject helper
     * functions
     * into the browser, so that debugging may be done in the browser console.
     *
     * This should be used under node in debug mode, i.e. with
     * protractor debug <configuration.js>
     *
     * @example
     * While in the debugger, commands can be scheduled through webdriver by
     * entering the repl:
     *   debug> repl
     *   Press Ctrl + C to leave rdebug repl
     *   > ptor.findElement(protractor.By.input('user').sendKeys('Laura'));
     *   > ptor.debugger();
     *   debug> c
     *
     * This will run the sendKeys command as the next task, then re-enter the
     * debugger.
     */
    Browser.prototype.debugger = function () {
        // jshint debug: true
        this.driver.executeScript(clientSideScripts.installInBrowser);
        webdriver.promise.controlFlow().execute(function () {
            debugger;
        }, 'add breakpoint to control flow');
    };
    /**
     * Validates that the port is free to use. This will only validate the first
     * time it is called. The reason is that on subsequent calls, the port will
     * already be bound to the debugger, so it will not be available, but that is
     * okay.
     *
     * @returns {Promise<boolean>} A promise that becomes ready when the
     * validation
     *     is done. The promise will resolve to a boolean which represents whether
     *     this is the first time that the debugger is called.
     */
    Browser.prototype.validatePortAvailability_ = function (port) {
        if (this.debuggerValidated_) {
            return webdriver.promise.fulfilled(false);
        }
        var doneDeferred = webdriver.promise.defer();
        // Resolve doneDeferred if port is available.
        var tester = net.connect({ port: port }, function () {
            doneDeferred.reject('Port ' + port + ' is already in use. Please specify ' +
                'another port to debug.');
        });
        tester.once('error', function (err) {
            if (err.code === 'ECONNREFUSED') {
                tester
                    .once('close', function () {
                    doneDeferred.fulfill(true);
                })
                    .end();
            }
            else {
                doneDeferred.reject('Unexpected failure testing for port ' + port + ': ' +
                    JSON.stringify(err));
            }
        });
        return doneDeferred.then(null, function (err) {
            console.error(err);
            process.exit(1);
        });
    };
    /**
     * Helper function to:
     *  1) Set up helper functions for debugger clients to call on (e.g.
     *     getControlFlowText, execute code, get autocompletion).
     *  2) Enter process into debugger mode. (i.e. process._debugProcess).
     *  3) Invoke the debugger client specified by debuggerClientPath.
     *
     * @param {string} debuggerClientPath Absolute path of debugger client to use
     * @param {Function} onStartFn Function to call when the debugger starts. The
     *     function takes a single parameter, which represents whether this is the
     *     first time that the debugger is called.
     * @param {number=} opt_debugPort Optional port to use for the debugging
     * process
     */
    Browser.prototype.initDebugger_ = function (debuggerClientPath, onStartFn, opt_debugPort) {
        // Patch in a function to help us visualize what's going on in the control
        // flow.
        webdriver.promise.ControlFlow.prototype.getControlFlowText = function () {
            var controlFlowText = this.getSchedule(/* opt_includeStackTraces */ true);
            // This filters the entire control flow text, not just the stack trace, so
            // unless we maintain a good (i.e. non-generic) set of keywords in
            // STACK_SUBSTRINGS_TO_FILTER, we run the risk of filtering out non stack
            // trace. The alternative though, which is to reimplement
            // webdriver.promise.ControlFlow.prototype.getSchedule() here is much
            // hackier, and involves messing with the control flow's internals /
            // private
            // variables.
            return helper.filterStackTrace(controlFlowText);
        };
        var vm_ = require('vm');
        var flow = webdriver.promise.controlFlow();
        var context = { require: require };
        global.list = function (locator) {
            /* globals browser */
            return global.browser.findElements(locator).then(function (arr) {
                var found = [];
                for (var i = 0; i < arr.length; ++i) {
                    arr[i].getText().then(function (text) {
                        found.push(text);
                    });
                }
                return found;
            });
        };
        for (var key in global) {
            context[key] = global[key];
        }
        var sandbox = vm_.createContext(context);
        var browserUnderDebug = this;
        var debuggerReadyPromise = webdriver.promise.defer();
        flow.execute(function () {
            process['debugPort'] = opt_debugPort || process['debugPort'];
            browserUnderDebug.validatePortAvailability_(process['debugPort'])
                .then(function (firstTime) {
                onStartFn(firstTime);
                var args = [process.pid, process['debugPort']];
                if (browserUnderDebug.debuggerServerPort_) {
                    args.push(browserUnderDebug.debuggerServerPort_);
                }
                var nodedebug = require('child_process').fork(debuggerClientPath, args);
                process.on('exit', function () {
                    nodedebug.kill('SIGTERM');
                });
                nodedebug.on('message', function (m) {
                    if (m === 'ready') {
                        debuggerReadyPromise.fulfill();
                    }
                });
            });
        });
        var pausePromise = flow.execute(function () {
            return debuggerReadyPromise.then(function () {
                // Necessary for backward compatibility with node < 0.12.0
                return browserUnderDebug.executeScript_('', 'empty debugger hook');
            });
        });
        // Helper used only by debuggers at './debugger/modes/*.js' to insert code
        // into the control flow.
        // In order to achieve this, we maintain a promise at the top of the control
        // flow, so that we can insert frames into it.
        // To be able to simulate callback/asynchronous code, we poll this object
        // for an result at every run of DeferredExecutor.execute.
        this.dbgCodeExecutor_ = {
            execPromise_: pausePromise,
            execPromiseResult_: undefined,
            execPromiseError_: undefined,
            // A dummy repl server to make use of its completion function.
            replServer_: require('repl').start({
                input: {
                    on: function () { },
                    resume: function () { }
                },
                output: { write: function () { } },
                useGlobal: true
            }),
            // Execute a function, which could yield a value or a promise,
            // and allow its result to be accessed synchronously
            execute_: function (execFn_) {
                var _this = this;
                this.execPromiseResult_ = this.execPromiseError_ = undefined;
                this.execPromise_ = this.execPromise_.then(execFn_).then(function (result) {
                    _this.execPromiseResult_ = result;
                }, function (err) {
                    _this.execPromiseError_ = err;
                });
                // This dummy command is necessary so that the DeferredExecutor.execute
                // break point can find something to stop at instead of moving on to the
                // next real command.
                this.execPromise_.then(function () {
                    return browserUnderDebug.executeScript_('', 'empty debugger hook');
                });
            },
            // Execute a piece of code.
            // Result is a string representation of the evaluation.
            execute: function (code) {
                var _this = this;
                var execFn_ = function () {
                    // Run code through vm so that we can maintain a local scope which is
                    // isolated from the rest of the execution.
                    var res = vm_.runInContext(code, sandbox);
                    if (!webdriver.promise.isPromise(res)) {
                        res = webdriver.promise.fulfilled(res);
                    }
                    return res.then(function (res) {
                        if (res === undefined) {
                            return undefined;
                        }
                        else {
                            // The '' forces res to be expanded into a string instead of just
                            // '[Object]'. Then we remove the extra space caused by the ''
                            // using
                            // substring.
                            return util.format.apply(_this, ['', res]).substring(1);
                        }
                    });
                };
                this.execute_(execFn_);
            },
            // Autocomplete for a line.
            // Result is a JSON representation of the autocomplete response.
            complete: function (line) {
                var _this = this;
                var execFn_ = function () {
                    var deferred = webdriver.promise.defer();
                    _this.replServer_.complete(line, function (err, res) {
                        if (err) {
                            deferred.reject(err);
                        }
                        else {
                            deferred.fulfill(JSON.stringify(res));
                        }
                    });
                    return deferred;
                };
                this.execute_(execFn_);
            },
            // Code finished executing.
            resultReady: function () {
                return !this.execPromise_.isPending();
            },
            // Get asynchronous results synchronously.
            // This will throw if result is not ready.
            getResult: function () {
                if (!this.resultReady()) {
                    throw new Error('Result not ready');
                }
                if (this.execPromiseError_) {
                    throw this.execPromiseError_;
                }
                return this.execPromiseResult_;
            }
        };
    };
    /**
     * Beta (unstable) enterRepl function for entering the repl loop from
     * any point in the control flow. Use browser.enterRepl() in your test.
     * Does not require changes to the command line (no need to add 'debug').
     * Note, if you are wrapping your own instance of Protractor, you must
     * expose globals 'browser' and 'protractor' for pause to work.
     *
     * @example
     * element(by.id('foo')).click();
     * browser.enterRepl();
     * // Execution will stop before the next click action.
     * element(by.id('bar')).click();
     *
     * @param {number=} opt_debugPort Optional port to use for the debugging
     * process
     */
    Browser.prototype.enterRepl = function (opt_debugPort) {
        var debuggerClientPath = __dirname + '/debugger/clients/explorer.js';
        var onStartFn = function () {
            logger.info();
            logger.info('------- Element Explorer -------');
            logger.info('Starting WebDriver debugger in a child process. Element ' +
                'Explorer is still beta, please report issues at ' +
                'github.com/angular/protractor');
            logger.info();
            logger.info('Type <tab> to see a list of locator strategies.');
            logger.info('Use the `list` helper function to find elements by strategy:');
            logger.info('  e.g., list(by.binding(\'\')) gets all bindings.');
            logger.info();
        };
        this.initDebugger_(debuggerClientPath, onStartFn, opt_debugPort);
    };
    /**
     * Beta (unstable) pause function for debugging webdriver tests. Use
     * browser.pause() in your test to enter the protractor debugger from that
     * point in the control flow.
     * Does not require changes to the command line (no need to add 'debug').
     * Note, if you are wrapping your own instance of Protractor, you must
     * expose globals 'browser' and 'protractor' for pause to work.
     *
     * @example
     * element(by.id('foo')).click();
     * browser.pause();
     * // Execution will stop before the next click action.
     * element(by.id('bar')).click();
     *
     * @param {number=} opt_debugPort Optional port to use for the debugging
     * process
     */
    Browser.prototype.pause = function (opt_debugPort) {
        var debuggerClientPath = __dirname + '/debugger/clients/wddebugger.js';
        var onStartFn = function (firstTime) {
            logger.info();
            logger.info('Encountered browser.pause(). Attaching debugger...');
            if (firstTime) {
                logger.info();
                logger.info('------- WebDriver Debugger -------');
                logger.info('Starting WebDriver debugger in a child process. Pause is ' +
                    'still beta, please report issues at github.com/angular/protractor');
                logger.info();
                logger.info('press c to continue to the next webdriver command');
                logger.info('press ^D to detach debugger and resume code execution');
                logger.info('type "repl" to enter interactive mode');
                logger.info('type "exit" to break out of interactive mode');
                logger.info();
            }
        };
        this.initDebugger_(debuggerClientPath, onStartFn, opt_debugPort);
    };
    /**
     * Create a new instance of Browser by wrapping a webdriver instance.
     *
     * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
     * @param {string=} opt_baseUrl A URL to prepend to relative gets.
     * @param {boolean=} opt_untrackOutstandingTimeouts Whether Browser should
     *     stop tracking outstanding $timeouts.
     * @returns {Browser} a new Browser instance
     */
    Browser.wrapDriver = function (webdriver, baseUrl, rootElement, untrackOutstandingTimeouts) {
        return new Browser(webdriver, baseUrl, rootElement, untrackOutstandingTimeouts);
    };
    /**
     * @type {ProtractorBy}
     */
    Browser.By = new locators_1.ProtractorBy();
    /**
     * @type {ExpectedConditions}
     */
    Browser.ExpectedConditions = new expectedConditions_1.ProtractorExpectedConditions();
    return Browser;
}(Webdriver));
exports.Browser = Browser;
