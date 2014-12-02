#!/usr/bin/env node

var Executor = require('./test/test_util').Executor;
var glob = require('glob').sync;

var passingTests = [
  'node lib/cli.js spec/basicConf.js',
  'node lib/cli.js spec/multiConf.js',
  'node lib/cli.js spec/altRootConf.js',
  'node lib/cli.js spec/onCleanUpAsyncReturnValueConf.js',
  'node lib/cli.js spec/onCleanUpNoReturnValueConf.js',
  'node lib/cli.js spec/onCleanUpSyncReturnValueConf.js',
  'node lib/cli.js spec/onPrepareConf.js',
  'node lib/cli.js spec/onPrepareFileConf.js',
  'node lib/cli.js spec/onPreparePromiseConf.js',
  'node lib/cli.js spec/onPreparePromiseFileConf.js',
  'node lib/cli.js spec/mochaConf.js',
  'node lib/cli.js spec/cucumberConf.js',
  'node lib/cli.js spec/withLoginConf.js',
  'node lib/cli.js spec/suitesConf.js --suite okmany',
  'node lib/cli.js spec/suitesConf.js --suite okspec',
  'node lib/cli.js spec/suitesConf.js --suite okmany,okspec',
  'node lib/cli.js spec/pluginsBasicConf.js',
  'node lib/cli.js spec/pluginsFullConf.js',
  'node lib/cli.js spec/ngHintSuccessConfig.js',
  'node lib/cli.js spec/interactionConf.js',
  'node lib/cli.js spec/directConnectConf.js'
];

passingTests.push(
    'node node_modules/.bin/minijasminenode ' +
    glob('spec/unit/*.js').join(' ') + ' ' +
    glob('website/docgen/spec/*.js').join(' '));

var executor = new Executor();

passingTests.forEach(function(passing_test) {
  executor.addCommandlineTest(passing_test)
      .assertExitCodeOnly();
});

/*************************
 *Below are failure tests*
 *************************/

// assert stacktrace shows line of failure
executor.addCommandlineTest('node lib/cli.js spec/errorTest/singleFailureConf.js')
    .expectExitCode(1)
    .expectErrors({
      stackTrace: 'single_failure_spec1.js:5:32'
    });

// assert timeout works 
executor.addCommandlineTest('node lib/cli.js spec/errorTest/timeoutConf.js')
    .expectExitCode(1)
    .expectErrors({
      message: 'timeout: timed out after 1 msec waiting for spec to complete'
    })
    .expectTestDuration(0, 100);

executor.addCommandlineTest('node lib/cli.js spec/errorTest/afterLaunchChangesExitCodeConf.js')
    .expectExitCode(11)
    .expectErrors({
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.'
    });

executor.addCommandlineTest('node lib/cli.js spec/errorTest/multiFailureConf.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec1.js:5:32'
    }, {
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec2.js:5:32'
    }]);

executor.addCommandlineTest('node lib/cli.js spec/errorTest/shardedFailureConf.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec1.js:5:32'
    }, {
      message: 'Expected \'Hiya\' to equal \'INTENTIONALLY INCORRECT\'.',
      stacktrace: 'single_failure_spec2.js:5:32'
    }]);

executor.addCommandlineTest('node lib/cli.js spec/errorTest/mochaFailureConf.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'expected \'My AngularJS App\' to equal \'INTENTIONALLY INCORRECT\'',
      stacktrace: 'mocha_failure_spec.js:11:20'
    }]);

// Check ngHint plugin

executor.addCommandlineTest('node lib/cli.js spec/ngHintFailConfig.js')
    .expectExitCode(1)
    .expectErrors([{
      message: 'warning -- ngHint plugin cannot be run as ngHint code was ' +
          'never included into the page'
    }, {
      message: 'warning -- ngHint is included on the page, but is not active ' +
          'because there is no `ng-hint` attribute present'
    }, {
      message: 'warning -- Module "xApp" was created but never loaded.'
    }]);

executor.execute();
