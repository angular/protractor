#!/usr/bin/env node

var glob = require('glob').sync;
var spawn = require('child_process').spawn;

var scripts = [
  'node lib/cli.js spec/basicConf.js',
  'node lib/cli.js spec/multiConf.js',
  'node lib/cli.js spec/multiSplitConf.js',
  'node lib/cli.js spec/altRootConf.js',
  'node lib/cli.js spec/onPrepareConf.js',
  'node lib/cli.js spec/mochaConf.js',
  'node lib/cli.js spec/cucumberConf.js',
  'node lib/cli.js spec/withLoginConf.js',
  'node lib/cli.js spec/suitesConf.js --suite okmany',
  'node lib/cli.js spec/suitesConf.js --suite okspec'
];

scripts.push(
    'node node_modules/.bin/minijasminenode jasminewd/spec/adapterSpec.js ' +
    glob('spec/unit/*.js').join(' ') + ' ' +
    glob('docs/spec/*.js').join(' '));

var failed = false;

(function runTests(i) {
  if (i < scripts.length) {
    console.log('node ' + scripts[i]);
    var args = scripts[i].split(/\s/);

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
