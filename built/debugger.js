"use strict";
var net = require('net');
var util = require('util');
var logger_1 = require('./logger');
var helper = require('./util');
var logger = new logger_1.Logger('protractor');
var webdriver = require('selenium-webdriver');
var DebugHelper = (function () {
    function DebugHelper(browserUnderDebug_) {
        this.browserUnderDebug_ = browserUnderDebug_;
    }
    /**
     *  1) Set up helper functions for debugger clients to call on (e.g.
     *     getControlFlowText, execute code, get autocompletion).
     *  2) Enter process into debugger mode. (i.e. process._debugProcess).
     *  3) Invoke the debugger client specified by debuggerClientPath.
     *
     * @param {string} debuggerClientPath Absolute path of debugger client to use.
     * @param {Function} onStartFn Function to call when the debugger starts. The
     *     function takes a single parameter, which represents whether this is the
     *     first time that the debugger is called.
     * @param {number=} opt_debugPort Optional port to use for the debugging
     *     process.
     */
    DebugHelper.prototype.init = function (debuggerClientPath, onStartFn, opt_debugPort) {
        var _this = this;
        webdriver.promise.ControlFlow.prototype.getControlFlowText = function () {
            var controlFlowText = this.getSchedule(/* opt_includeStackTraces */ true);
            // This filters the entire control flow text, not just the stack trace, so
            // unless we maintain a good (i.e. non-generic) set of keywords in
            // STACK_SUBSTRINGS_TO_FILTER, we run the risk of filtering out non stack
            // trace. The alternative though, which is to reimplement
            // webdriver.promise.ControlFlow.prototype.getSchedule() here is much
            // hackier, and involves messing with the control flow's internals /
            // private variables.
            return helper.filterStackTrace(controlFlowText);
        };
        var vm_ = require('vm');
        var flow = webdriver.promise.controlFlow();
        var context = { require: require };
        global.list = function (locator) {
            return global.protractor
                .browser.findElements(locator)
                .then(function (arr) {
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
        var debuggerReadyPromise = webdriver.promise.defer();
        flow.execute(function () {
            process['debugPort'] = opt_debugPort || process['debugPort'];
            _this.validatePortAvailability_(process['debugPort']).then(function (firstTime) {
                onStartFn(firstTime);
                var args = [process.pid, process['debugPort']];
                if (_this.browserUnderDebug_.debuggerServerPort) {
                    args.push(_this.browserUnderDebug_.debuggerServerPort);
                }
                var nodedebug = require('child_process').fork(debuggerClientPath, args);
                process.on('exit', function () {
                    nodedebug.kill('SIGTERM');
                });
                nodedebug
                    .on('message', function (m) {
                    if (m === 'ready') {
                        debuggerReadyPromise.fulfill();
                    }
                })
                    .on('exit', function () {
                    logger.info('Debugger exiting');
                    // Clear this so that we know it's ok to attach a debugger
                    // again.
                    _this.dbgCodeExecutor = null;
                });
            });
        });
        var pausePromise = flow.execute(function () {
            return debuggerReadyPromise.then(function () {
                // Necessary for backward compatibility with node < 0.12.0
                return _this.browserUnderDebug_.executeScriptWithDescription('', 'empty debugger hook');
            });
        });
        // Helper used only by debuggers at './debugger/modes/*.js' to insert code
        // into the control flow.
        // In order to achieve this, we maintain a promise at the top of the control
        // flow, so that we can insert frames into it.
        // To be able to simulate callback/asynchronous code, we poll this object
        // for a result at every run of DeferredExecutor.execute.
        var browserUnderDebug = this.browserUnderDebug_;
        this.dbgCodeExecutor = {
            execPromise_: pausePromise,
            execPromiseResult_: undefined,
            execPromiseError_: undefined,
            // A dummy repl server to make use of its completion function.
            replServer_: require('repl').start({
                input: { on: function () { }, resume: function () { } },
                // dummy readable stream
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
                    return browserUnderDebug.executeScriptWithDescription('', 'empty debugger hook');
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
        return pausePromise;
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
    DebugHelper.prototype.validatePortAvailability_ = function (port) {
        var _this = this;
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
                doneDeferred.reject('Unexpected failure testing for port ' + port + ': ' + JSON.stringify(err));
            }
        });
        return doneDeferred.then(function () {
            _this.debuggerValidated_ = true;
        }, function (err) {
            console.error(err);
            process.exit(1);
        });
    };
    DebugHelper.prototype.isAttached = function () {
        return !!this.dbgCodeExecutor;
    };
    return DebugHelper;
}());
exports.DebugHelper = DebugHelper;
