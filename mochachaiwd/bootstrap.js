global.chai = require('chai');
global.expect = chai.expect;

var promiseTesting = require('promise-testing');
global.promiseEngine = new promiseTesting();
promiseEngine.scanChai(chai);

require('./index.js');