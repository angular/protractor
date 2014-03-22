var Q = require('q');

exports.config = Q({
  onPrepare: 'foo/bar.js',
  specs: [ 'fakespec*.js' ],
  rootElement: '.mycontainer'
}).delay(10);
	