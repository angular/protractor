var util = require('util');
var protractor = require('../lib/protractor.js');


describe('angularjs homepage', function() {
  var ptor = process.protractorInstance;
  //var ptor = protractor.getInstance();

  it('should greet using binding', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Julie");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).toEqual('Hello Julie!');
          done();
        });
  }, 100000);

  it('should greet using binding - #2', function(done) {
    ptor.get('http://www.angularjs.org');

    ptor.findElement(protractor.By.input("yourName")).sendKeys("Jane");

    ptor.findElement(protractor.By.binding("Hello {{yourName}}!")).
        getText().then(function(text) {
          expect(text).toEqual('Hello Jane!');
          done();
        });
  }, 100000);

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
