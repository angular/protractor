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
