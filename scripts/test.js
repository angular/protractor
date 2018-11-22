#!/usr/bin/env node
var path = require('path');

var Executor = require('./test/test_util').Executor;

var passingTests = [
  'node built/cli.js spec/basic.conf.js',
  'node built/cli.js spec/basic.conf.js --useBlockingProxy',
  'node built/cli.js spec/multi.conf.js',
  'node built/cli.js spec/altRoot.conf.js',
  'node built/cli.js spec/inferRoot.conf.js',
  'node built/cli.js spec/onCleanUpAsyncReturnValue.conf.js',
  'node built/cli.js spec/onCleanUpNoReturnValue.conf.js',
  'node built/cli.js spec/onCleanUpSyncReturnValue.conf.js',
  'node built/cli.js spec/onPrepare.conf.js',
  'node built/cli.js spec/onPrepareFile.conf.js',
  'node built/cli.js spec/onPreparePromise.conf.js',
  'node built/cli.js spec/onPreparePromiseFile.conf.js',
  'node built/cli.js spec/mocha.conf.js',
  'node built/cli.js spec/withLogin.conf.js',
  'node built/cli.js spec/suites.conf.js --suite okmany',
  'node built/cli.js spec/suites.conf.js --suite okspec',
  'node built/cli.js spec/suites.conf.js --suite okmany,okspec',
  'node built/cli.js spec/plugins/smoke.conf.js',
  'node built/cli.js spec/plugins/multiPlugin.conf.js',
  'node built/cli.js spec/plugins/jasminePostTest.conf.js',
  'node built/cli.js spec/plugins/mochaPostTest.conf.js',
  'node built/cli.js spec/plugins/browserGetSynced.conf.js',
  'node built/cli.js spec/plugins/browserGetUnsynced.conf.js',
  'node built/cli.js spec/plugins/waitForAngular.conf.js',
  'node built/cli.js spec/interaction.conf.js',
  'node built/cli.js spec/directConnect.conf.js',
  'node built/cli.js spec/restartBrowserBetweenTests.conf.js',
  'node built/cli.js spec/driverProviderLocal.conf.js',
  'node built/cli.js spec/driverProviderLocal.conf.js --useBlockingProxy',
  'node built/cli.js spec/getCapabilities.conf.js',
  'node built/cli.js spec/controlLock.conf.js',
  'node built/cli.js spec/customFramework.conf.js',
  'node built/cli.js spec/noGlobals.conf.js',
  'node built/cli.js spec/angular2.conf.js',
  'node built/cli.js spec/hybrid.conf.js',
  'node built/cli.js spec/built/noCFBasic.conf.js',
  'node built/cli.js spec/built/noCFBasic.conf.js --useBlockingProxy',
  'node built/cli.js spec/built/noCFPlugin.conf.js',
  'node scripts/driverProviderAttachSession.js',
  'node scripts/errorTest.js',
  // Interactive Element Explorer tasks
  // 'node scripts/interactive_tests/interactive_test.js',
  // 'node scripts/interactive_tests/with_base_url.js',
  // Unit tests
  'node node_modules/jasmine/bin/jasmine.js JASMINE_CONFIG_PATH=scripts/unit_test.json',
  // Dependency tests
  'node node_modules/jasmine/bin/jasmine.js JASMINE_CONFIG_PATH=scripts/dependency_test.json',
  // Typings tests
  'node spec/install/test.js'
];

const executor = new Executor();

passingTests.forEach(function(passing_test) {
  executor.addCommandlineTest(passing_test)
      .assertExitCodeOnly();
});

/*************************
 *Below are failure tests*
 *************************/

// assert stacktrace shows line of failure
executor.addCommandlineTest('node built/cli.js spec/errorTest/singleFailure.conf.js')
    .expectExitCode(1)
    .expectErrors({
      stackTrace: 'single_failure_spec1.js:5:38'
    });

// assert timeout works
executor.addCommandlineTest('node built/cli.js spec/errorTest/timeout.conf.js')
    .expectExitCode(1)
    .expectErrors({
      message: 'Timeout - Async callback was not invoked within timeout ' +
          'specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.'
    })
    .expectTestDuration(0, 1000);

executor.addCommandlineTest('node built/cli.js spec/errorTest/afterLaunchChangesExitCode.conf.js')
    .expectExitCode(11)
    .expectErrors({
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.'
    });

executor.addCommandlineTest('node built/cli.js spec/errorTest/multiFailure.conf.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec1.js:5:32'
    }, {
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec2.js:5:32'
    }]);

executor.addCommandlineTest('node built/cli.js spec/errorTest/shardedFailure.conf.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec1.js:5:32'
    }, {
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec2.js:5:32'
    }]);

executor.addCommandlineTest('node built/cli.js spec/errorTest/mochaFailure.conf.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'expected \'My AngularJS App\' to equal \'INTENTIONALLY INCORRECT\'',
      stacktrace: 'mocha_failure_spec.js:11:20'
    }]);

executor.addCommandlineTest('node built/cli.js spec/errorTest/pluginsFailing.conf.js')
    .expectExitCode(1)
    .expectErrors([
      {message: 'Expected true to be false'},
      {message: 'from setup'},
      {message: 'from postTest passing'},
      {message: 'from postTest failing'},
      {message: 'from teardown'}
    ]);

// TODO(selenium4): turn these on when we figure out the correct error message handling.
// executor.addCommandlineTest('node built/cli.js spec/errorTest/slowHttpAndTimeout.conf.js')
//     .expectExitCode(1)
//     .expectErrors([
//       {message: 'The following tasks were pending[\\s\\S]*\\$http: slowcall'},
//       {message: 'The following tasks were pending:[\\s\\S]*' +
//                 '- \\$timeout: function\\(\\) {[\\s\\S]*' +
//                   '\\$scope\\.slowAngularTimeoutStatus = \'done\';[\\s\\S]' +
//                 '*}'}
//     ]);

// TODO(selenium4): turn these on when we figure out the correct error message handling.
// executor.addCommandlineTest('node built/cli.js spec/errorTest/slowHttpAndTimeout.conf.js ' +
//                             '--untrackOutstandingTimeouts true')
//     .expectExitCode(1)
//     .expectErrors([
//       {message: 'The following tasks were pending[\\s\\S]*\\$http: slowcall'},
//       {message: 'While waiting for element with locator - ' +
//                 'Locator: by.binding\\(\\"slowAngularTimeoutStatus\\"\\)$'}
//     ]);

// TODO(selenium4): turn these on when we figure out the correct error message handling.
// executor.addCommandlineTest('node built/cli.js spec/angular2Timeout.conf.js')
//     .expectExitCode(1)
//     .expectErrors([
//       {message: 'Timed out waiting for asynchronous Angular tasks to finish'},
//     ]);

// If we're running on CircleCI, save stdout and stderr from the test run to a log file.
if (process.env['CIRCLE_ARTIFACTS']) {
  executor.execute(path.join(process.env['CIRCLE_ARTIFACTS'], 'test_log.txt'));
} else {
  executor.execute();
}
