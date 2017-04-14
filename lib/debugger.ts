import * as net from 'net';
import {promise as wdpromise, WebElement} from 'selenium-webdriver';
import * as util from 'util';

import {ProtractorBrowser} from './browser';
import {Locator} from './locators';
import {Logger} from './logger';
import {Ptor} from './ptor';
import * as helper from './util';
let breakpointHook = require('./breakpointhook.js');

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


  initBlocking(debuggerClientPath: string, onStartFn: Function, opt_debugPort?: number) {
    this.init_(debuggerClientPath, true, onStartFn, opt_debugPort);
  }

  init(debuggerClientPath: string, onStartFn: Function, opt_debugPort?: number) {
    this.init_(debuggerClientPath, false, onStartFn, opt_debugPort);
  }

  /**
   *  1) Set up helper functions for debugger clients to call on (e.g.
   *     execute code, get autocompletion).
   *  2) Enter process into debugger mode. (i.e. process._debugProcess).
   *  3) Invoke the debugger client specified by debuggerClientPath.
   *
   * @param {string} debuggerClientPath Absolute path of debugger client to use.
   * @param {boolean} blockUntilExit Whether to block the flow until process exit or resume
   *     immediately.
   * @param {Function} onStartFn Function to call when the debugger starts. The
   *     function takes a single parameter, which represents whether this is the
   *     first time that the debugger is called.
   * @param {number=} opt_debugPort Optional port to use for the debugging
   *     process.
   *
   * @return {Promise} If blockUntilExit, a promise resolved when the debugger process
   *     exits. Otherwise, resolved when the debugger process is ready to begin.
   */
  init_(
      debuggerClientPath: string, blockUntilExit: boolean, onStartFn: Function,
      opt_debugPort?: number) {
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

    let debuggingDone = wdpromise.defer();

    // We run one flow.execute block for the debugging session. All
    // subcommands should be scheduled under this task.
    let executePromise = flow.execute(() => {
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
                    breakpointHook();
                    if (!blockUntilExit) {
                      debuggingDone.fulfill();
                    }
                  }
                })
            .on('exit', () => {
              // Clear this so that we know it's ok to attach a debugger
              // again.
              this.dbgCodeExecutor = null;
              debuggingDone.fulfill();
            });
      });
      return debuggingDone.promise;
    }, 'debugging tasks');

    // Helper used only by debuggers at './debugger/modes/*.js' to insert code
    // into the control flow, via debugger 'evaluate' protocol.
    // In order to achieve this, we maintain a task at the top of the control
    // flow, so that we can insert frames into it.
    // To be able to simulate callback/asynchronous code, we poll this object
    // whenever `breakpointHook` is called.
    this.dbgCodeExecutor = {
      execPromise_: undefined,        // Promise pointing to currently executing command.
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

        this.execPromise_ = execFn_();
        // Note: This needs to be added after setting execPromise to execFn,
        // or else we cause this.execPromise_ to get stuck in pending mode
        // at our next breakpoint.
        this.execPromise_.then(
            (result: Object) => {
              this.execPromiseResult_ = result;
              breakpointHook();
            },
            (err: Error) => {
              this.execPromiseError_ = err;
              breakpointHook();
            });
      },

      // Execute a piece of code.
      // Result is a string representation of the evaluation.
      execute: function(code: Function) {
        let execFn_ = () => {
          // Run code through vm so that we can maintain a local scope which is
          // isolated from the rest of the execution.
          let res: wdpromise.Promise<any>;
          try {
            res = vm_.runInContext(code, sandbox);
          } catch (e) {
            res = wdpromise.when('Error while evaluating command: ' + e);
          }
          if (!wdpromise.isPromise(res)) {
            res = wdpromise.when(res);
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
          return deferred.promise;
        };
        this.execute_(execFn_);
      },

      // Code finished executing.
      resultReady: function() {
        return !(this.execPromise_.state_ === 'pending');
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

    return executePromise;
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
  private validatePortAvailability_(port: number): wdpromise.Promise<boolean> {
    if (this.debuggerValidated_) {
      return wdpromise.when(false);
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
        (firstTime: boolean) => {
          this.debuggerValidated_ = true;
          return firstTime;
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
