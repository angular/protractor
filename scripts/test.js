#!/usr/bin/env node

var glob = require('glob').sync;
var spawn = require('child_process').spawn;
var isWindows = process.platform.indexOf('win') === 0;
var path = require('path');

var scripts = [
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
  'node lib/cli.js spec/suitesConf.js --suite okmany,okspec'
];

scripts.push(
  (isWindows? 'node_modules/.bin/minijasminenode.cmd' : 'node node_modules/.bin/minijasminenode') + ' ' +
  glob('spec/unit/*.js').join(' ') + ' ' +
  glob('docgen/spec/*.js').join(' ')
);

var failed = false;

(function runTests(i) {
  if (i < scripts.length) {
    var command = scripts[i];
    if (isWindows) {
      command = path.normalize(command);
    }
    console.log('node ' + command);
    var args = command.split(/\s/);

    var test = spawn(args[0], args.slice(1), {stdio: 'inherit'});
    test.on('error', function(err) {
      throw err;
    });
    test.on('exit', function(code) {
      if (code != 0) {
        failed = true;
      }
      runTests(i + 1);
    });
  } else {
    process.exit(failed ? 1 : 0);
  }
}(0));
