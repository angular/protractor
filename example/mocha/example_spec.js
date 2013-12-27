/**
 * This example shows how to use the protractor library in a Mocha test.
 *
 * Run this test with:
 *   protractor example/mocha/mochaConf.js
 */

// Use the external Chai As Promised to deal with resolving promises in
// expectations.
var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

var expect = chai.expect;

describe('angularjs.org homepage', function() {
  this.timeout(80000);

  it('should greet using binding', function() {
    browser.get('http://www.angularjs.org');

    element(by.input('yourName')).sendKeys('Julie');

    expect(element(by.binding('{{yourName}}')).getText()).
        to.eventually.equal('Hello Julie!');
  });

  it('should list todos', function() {
    browser.get('http://www.angularjs.org');

    var todo = element(by.repeater('todo in todos').row(1));

    expect(todo.getText()).to.eventually.equal('build an angular app');
  });
});
