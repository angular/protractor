#!/usr/bin/env node

var glob = require('glob').sync;
var spawn = require('child_process').spawn;

var scripts = [];

// Dgeni tests.
scripts.push(
  'node node_modules/.bin/jasmine JASMINE_CONFIG_PATH=unit_test.json');

// Karma tests.
scripts.push('node_modules/karma/bin/karma start --singleRun true');

// Protractor.
scripts.push('../bin/protractor');

var failed = false;

(function runTests(i) {
  if (i < scripts.length) {
    console.log(scripts[i]);
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
