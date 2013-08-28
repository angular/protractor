var util = require('util');

describe('no ptor at all', function() {
  it('should still do normal tests', function() {
    expect(true).toBe(true);
  });
});

describe('protractor library', function() {
  var ptor = protractor.getInstance();

  it('should wrap webdriver', function() {
    ptor.get('app/index.html');
    expect(ptor.getTitle()).toEqual('My AngularJS App');
  });

  it('should allow a mix of using protractor and using the driver directly',
    function() {
      ptor.get('app/index.html');
      expect(ptor.getCurrentUrl()).
          toEqual('http://localhost:8000/app/index.html#/http')

      ptor.driver.findElement(protractor.By.linkText('repeater')).click();
      expect(ptor.driver.getCurrentUrl()).
          toEqual('http://localhost:8000/app/index.html#/repeater');

      ptor.navigate().back();
      expect(ptor.driver.getCurrentUrl()).
          toEqual('http://localhost:8000/app/index.html#/http');
    });

  it('should export other webdriver classes onto the global protractor',
      function() {
        expect(protractor.ActionSequence).toBeDefined();
        expect(protractor.Key.RETURN).toEqual('\uE006');
    });
});
