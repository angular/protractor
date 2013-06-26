var util = require('util');
var protractor = require('../lib/protractor.js');


describe('angularjs homepage', function() {
  var ptor;

  it('should greet using binding', function(done) {
    ptor = protractor.getInstance();

    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).toEqual('Hello Julie!');
          done();
        });
  }, 100000);

  it('should list todos', function(done) {
    ptor.get('http://www.angularjs.org');

    var todo = ptor.findElement(
        protractor.By.repeater('todo in todos').row(2));

    todo.getText().then(function(text) {
      expect(text).toEqual('build an angular app');
      done();
    });
  }, 10000);

  // Uncomment to see failures.

  // it('should greet using binding - this one fails', function(done) {
  //   ptor.get('http://www.angularjs.org');

  //   ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

  //   ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
  //       getText().then(function(text) {
  //         expect(text).toEqual('Hello Jack');
  //         done();
  //       });
  // });

});
