#!/usr/bin/env node

var glob = require('glob').sync;

var scripts = ['basicConf', 'multiConf', 'altRootConf', 'onPrepareConf', 'mochaConf', 'cucumberConf', 'withLoginConf'].map(function(i) {
	return 'lib/cli.js spec/' + i + '.js';
});
scripts.push('lib/cli.js spec/suitesConf.js --suite okmany');
scripts.push('lib/cli.js spec/suitesConf.js --suite okspec');

var unitTests = ['node_modules/minijasminenode/bin/minijn  jasminewd/spec/adapterSpec.js'];
scripts.push(unitTests.concat(glob('spec/unit/*.js'), glob('docs/spec/*.js')).join(' '));

var fork = require('child_process').fork;
(function runTests(i) {
	if (i < scripts.length) {
		console.log('node ' + scripts[i]);
		var args = scripts[i].split(/\s/);
		var test = fork(args[0], args.slice(1));
		test.on('error', function(err) {
			throw err
		});
		test.on('exit', function() {
			runTests(i + 1);
		});
	} else {
		console.log('All tests completed');
	}
}(0));