/**
 * This example shows how to use the protractor library in a Mocha test.
 *
 * Run this test with:
 *   protractor example/mocha/mochaConf.js
 */

// Note that there is nothing adapting expect.js to understand promises,
// so we may only use it once promises have been resolved.
var expect = require('expect.js');

describe('angularjs.org homepage', function() {
  this.timeout(80000);

  it('should greet using binding', function() {
    browser.get('http://www.angularjs.org');

    element(by.input('yourName')).sendKeys('Julie');

    element(by.binding('{{yourName}}')).
        getText().then(function(text) {
          expect(text).to.eql('Hello Julie!');
        });
  });

  it('should list todos', function() {
    browser.get('http://www.angularjs.org');

    var todo = element(by.repeater('todo in todos').row(1));

    todo.getText().then(function(text) {
      expect(text).to.eql('build an angular app');
    });
  });
});
