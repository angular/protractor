var protractor = require('../lib/protractor.js');
var util = require('util');
require('../jasminewd');

describe('no ptor at all', function() {
  it('should still do normal tests', function() {
    expect(true).toBe(true);
  });
});

describe('protractor library', function() {
  var ptor = protractor.getInstance();

  it('should wrap webdriver', function() {
    ptor.get('app/index.html');
    ptor.getTitle().then(function(title) {
      expect(title).toEqual('My AngularJS App');
    });
  });

  it('should allow a mix of using protractor and using the driver directly',
    function() {
      ptor.get('app/index.html');
      ptor.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:8000/app/index.html#/http')
      });
      ptor.driver.findElement(protractor.By.linkText('repeater')).click();
      ptor.driver.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:8000/app/index.html#/repeater');
      });
      ptor.navigate().back();
      ptor.driver.getCurrentUrl().then(function(url) {
        expect(url).toEqual('http://localhost:8000/app/index.html#/http');
      });
    });
});
