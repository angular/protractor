/**
 * Execute the Runner's test cases through Mocha.
 *
 * @param {Runner} runner The current Protractor Runner.
 * @param {Array} specs Array of Directory Path Strings.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = (runner, specs) => {
  const Mocha = require('mocha');
  const mocha = new Mocha(runner.getConfig().mochaOpts);

  // Add hooks for afterEach
  require('./setupAfterEach').setup(runner, specs);

  return new Promise(async (resolve, reject) => {
    // Mocha doesn't set up the ui until the pre-require event, so
    // wait until then to load mocha-webdriver adapters as well.
    mocha.suite.on('pre-require', () => {
      try {
        // We need to re-wrap all of the global functions, which `selenium-webdriver/testing` only
        // does when it is required. So first we must remove it from the cache.
        delete require.cache[require.resolve('selenium-webdriver/testing')];
        const seleniumAdapter = require('selenium-webdriver/testing');

        // Save unwrapped version
        let unwrappedFns = {};
        ['after', 'afterEach', 'before', 'beforeEach', 'it', 'xit', 'iit'].forEach((fnName) => {
          unwrappedFns[fnName] = global[fnName] || Mocha[fnName];
        });

        const wrapFn = (seleniumWrappedFn, opt_fnName) => {
          // This does not work on functions that can be nested (e.g. `describe`)
          return function() {
            // Set globals to unwrapped version to avoid circular reference
            let wrappedFns = {};
            for (let fnName in unwrappedFns) {
              wrappedFns[fnName] = global[fnName];
              global[fnName] = unwrappedFns[fnName];
            }

            let args = arguments;
            // Allow before/after hooks to use names
            if (opt_fnName && (arguments.length > 1) && (seleniumWrappedFn.length < 2)) {
              global[opt_fnName] = global[opt_fnName].bind(this, args[0]);
              args = Array.prototype.slice.call(arguments, 1);
            }

            try {
              seleniumWrappedFn.apply(this, args);
            } finally {
              // Restore wrapped version
              for (fnName in wrappedFns) {
                global[fnName] = wrappedFns[fnName];
              }
            }
          };
        };

        // Wrap functions
        global.after = wrapFn(seleniumAdapter.after, 'after');
        global.afterEach = wrapFn(seleniumAdapter.afterEach, 'afterEach');
        global.before = wrapFn(seleniumAdapter.before, 'before');
        global.beforeEach = wrapFn(seleniumAdapter.beforeEach, 'beforeEach');

        global.it = wrapFn(seleniumAdapter.it);
        global.iit = wrapFn(seleniumAdapter.it.only);
        global.xit = wrapFn(seleniumAdapter.xit);
        global.it.only = wrapFn(seleniumAdapter.it.only);
        global.it.skip = wrapFn(seleniumAdapter.it.skip);
      } catch (err) {
        reject(err);
      }
    });

    mocha.loadFiles();

    try {
      await runner.runTestPreparer();
      specs.forEach((file) => {
        mocha.addFile(file);
      });
      let testResult = [];

      const mochaRunner = mocha.run(async (failures) => {
        try {
          if (runner.getConfig().onComplete) {
            await runner.getConfig().onComplete();
          }
          resolve({
            failedCount: failures,
            specResults: testResult
          });
        } catch (err) {
          reject(err);
        }
      });

      mochaRunner.on('pass', (test) => {
        const testInfo = {
          name: test.title,
          category: test.fullTitle().slice(0, -test.title.length).trim()
        };
        runner.emit('testPass', testInfo);
        testResult.push({
          description: test.title,
          assertions: [{
            passed: true
          }],
          duration: test.duration
        });
      });

      mochaRunner.on('fail', (test) => {
        const testInfo = {
          name: test.title,
          category: test.fullTitle().slice(0, -test.title.length).trim()
        };
        runner.emit('testFail', testInfo);
        testResult.push({
          description: test.title,
          assertions: [{
            passed: false,
            errorMsg: test.err.message,
            stackTrace: test.err.stack
          }],
          duration: test.duration
        });
      });
    } catch (err) {
      reject(err);
    }
  });  
};
