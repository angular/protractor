import * as net from 'net';
import {promise as wdpromise, WebElement} from 'selenium-webdriver';
import * as util from 'util';

import {ProtractorBrowser} from './browser';
import {Locator} from './locators';
import {Logger} from './logger';
import {Ptor} from './ptor';
import * as helper from './util';

declare var global: any;
declare var process: any;

let logger = new Logger('protractor');

export class DebugHelper {
  /**
   * Set to true when we validate that the debug port is open. Since the debug
   * port is held open forever once the debugger is attached, it's important
   * we only do validation once.
   */
  debuggerValidated_: boolean;

  dbgCodeExecutor: any;

  constructor(private browserUnderDebug_: ProtractorBrowser) {}

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
  init(debuggerClientPath: string, onStartFn: Function, opt_debugPort?: number) {
    (wdpromise.ControlFlow as any).prototype.getControlFlowText = function() {
      let controlFlowText = this.getSchedule(/* opt_includeStackTraces */ true);
      // This filters the entire control flow text, not just the stack trace, so
      // unless we maintain a good (i.e. non-generic) set of keywords in
      // STACK_SUBSTRINGS_TO_FILTER, we run the risk of filtering out non stack
      // trace. The alternative though, which is to reimplement
      // webdriver.promise.ControlFlow.prototype.getSchedule() here is much
      // hackier, and involves messing with the control flow's internals /
      // private variables.
      return helper.filterStackTrace(controlFlowText);
    };

    const vm_ = require('vm');
    let flow = wdpromise.controlFlow();

    interface Context {
      require: any;
      [key: string]: any;
    }
    let context: Context = {require: require};
    global.list = (locator: Locator) => {
      return (<Ptor>global.protractor).browser.findElements(locator).then((arr: WebElement[]) => {
        let found: string[] = [];
        for (let i = 0; i < arr.length; ++i) {
          arr[i].getText().then((text: string) => {
            found.push(text);
          });
        }
        return found;
      });
    };
    for (let key in global) {
      context[key] = global[key];
    }
    let sandbox = vm_.createContext(context);

    let debuggerReadyPromise = wdpromise.defer();
    flow.execute(() => {
      process['debugPort'] = opt_debugPort || process['debugPort'];
      this.validatePortAvailability_(process['debugPort']).then((firstTime: boolean) => {
        onStartFn(firstTime);

        let args = [process.pid, process['debugPort']];
        if (this.browserUnderDebug_.debuggerServerPort) {
          args.push(this.browserUnderDebug_.debuggerServerPort);
        }
        let nodedebug = require('child_process').fork(debuggerClientPath, args);
        process.on('exit', function() {
          nodedebug.kill('SIGTERM');
        });
        nodedebug
            .on('message',
                (m: string) => {
                  if (m === 'ready') {
                    debuggerReadyPromise.fulfill();
                  }
                })
            .on('exit', () => {
              logger.info('Debugger exiting');
              // Clear this so that we know it's ok to attach a debugger
              // again.
              this.dbgCodeExecutor = null;
            });
      });
    });

    let pausePromise = flow.execute(() => {
      return debuggerReadyPromise.promise.then(() => {
        // Necessary for backward compatibility with node < 0.12.0
        return this.browserUnderDebug_.executeScriptWithDescription('', 'empty debugger hook');
      });
    });

    // Helper used only by debuggers at './debugger/modes/*.js' to insert code
    // into the control flow.
    // In order to achieve this, we maintain a promise at the top of the control
    // flow, so that we can insert frames into it.
    // To be able to simulate callback/asynchronous code, we poll this object
    // for a result at every run of DeferredExecutor.execute.
    let browserUnderDebug = this.browserUnderDebug_;
    this.dbgCodeExecutor = {
      execPromise_: pausePromise,     // Promise pointing to current stage of flow.
      execPromiseResult_: undefined,  // Return value of promise.
      execPromiseError_: undefined,   // Error from promise.

      // A dummy repl server to make use of its completion function.
      replServer_: require('repl').start({
        input: {on: function() {}, resume: function() {}},
        // dummy readable stream
        output: {write: function() {}},  // dummy writable stream
        useGlobal: true
      }),

      // Execute a function, which could yield a value or a promise,
      // and allow its result to be accessed synchronously
      execute_: function(execFn_: Function) {
        this.execPromiseResult_ = this.execPromiseError_ = undefined;

        this.execPromise_ = this.execPromise_.then(execFn_).then(
            (result: Object) => {
              this.execPromiseResult_ = result;
            },
            (err: Error) => {
              this.execPromiseError_ = err;
            });

        // This dummy command is necessary so that the DeferredExecutor.execute
        // break point can find something to stop at instead of moving on to the
        // next real command.
        this.execPromise_.then(() => {
          return browserUnderDebug.executeScriptWithDescription('', 'empty debugger hook');
        });
      },

      // Execute a piece of code.
      // Result is a string representation of the evaluation.
      execute: function(code: Function) {
        let execFn_ = () => {
          // Run code through vm so that we can maintain a local scope which is
          // isolated from the rest of the execution.
          let res = vm_.runInContext(code, sandbox);
          if (!wdpromise.isPromise(res)) {
            res = wdpromise.fulfilled(res);
          }

          return res.then((res: any) => {
            if (res === undefined) {
              return undefined;
            } else {
              // The '' forces res to be expanded into a string instead of just
              // '[Object]'. Then we remove the extra space caused by the ''
              // using substring.
              return util.format.apply(this, ['', res]).substring(1);
            }
          });
        };
        this.execute_(execFn_);
      },

      // Autocomplete for a line.
      // Result is a JSON representation of the autocomplete response.
      complete: function(line: string) {
        let execFn_ = () => {
          let deferred = wdpromise.defer();
          this.replServer_.complete(line, (err: any, res: any) => {
            if (err) {
              deferred.reject(err);
            } else {
              deferred.fulfill(JSON.stringify(res));
            }
          });
          return deferred;
        };
        this.execute_(execFn_);
      },

      // Code finished executing.
      resultReady: function() {
        return !this.execPromise_.isPending();
      },

      // Get asynchronous results synchronously.
      // This will throw if result is not ready.
      getResult: function() {
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
  }

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
  private validatePortAvailability_(port: number): wdpromise.Promise<any> {
    if (this.debuggerValidated_) {
      return wdpromise.fulfilled(false);
    }

    let doneDeferred = wdpromise.defer();

    // Resolve doneDeferred if port is available.
    let tester = net.connect({port: port}, () => {
      doneDeferred.reject(
          'Port ' + port + ' is already in use. Please specify ' +
          'another port to debug.');
    });
    tester.once('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'ECONNREFUSED') {
        tester
            .once(
                'close',
                () => {
                  doneDeferred.fulfill(true);
                })
            .end();
      } else {
        doneDeferred.reject(
            'Unexpected failure testing for port ' + port + ': ' + JSON.stringify(err));
      }
    });

    return doneDeferred.promise.then(
        () => {
          this.debuggerValidated_ = true;
        },
        (err: string) => {
          console.error(err);
          process.exit(1);
        });
  }

  public isAttached(): boolean {
    return !!this.dbgCodeExecutor;
  }
}
