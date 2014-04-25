var util = require('util');
var port =  process.env.HTTP_PORT || '8000';

describe('no protractor at all', function() {
  it('should still do normal tests', function() {
    expect(true).toBe(true);
  });
});

describe('protractor library', function() {
  it('should expose the correct global variables', function() {
    expect(protractor).toBeDefined();
    expect(browser).toBeDefined();
    expect(by).toBeDefined();
    expect(By).toBeDefined();
    expect(element).toBeDefined();
    expect($).toBeDefined();
  });

  it('should wrap webdriver', function() {
    browser.get('index.html');
    expect(browser.getTitle()).toEqual('My AngularJS App');
  });

  it('should export custom parameters to the protractor instance', function() {
    expect(browser.params.login).toBeDefined();
    expect(browser.params.login.user).toEqual('Jane');
    expect(browser.params.login.password).toEqual('1234');
  });

  it('should allow a mix of using protractor and using the driver directly',
    function() {
      browser.get('index.html');
      expect(browser.getCurrentUrl()).
          toEqual('http://localhost:'+port+'/index.html#/form');

      browser.driver.findElement(protractor.By.linkText('repeater')).click();
      expect(browser.driver.getCurrentUrl()).
          toEqual('http://localhost:'+port+'/index.html#/repeater');

      browser.navigate().back();
      expect(browser.driver.getCurrentUrl()).
          toEqual('http://localhost:'+port+'/index.html#/form');
    });

  it('should export other webdriver classes onto the global protractor',
      function() {
        expect(protractor.ActionSequence).toBeDefined();
        expect(protractor.Key.RETURN).toEqual('\uE006');
    });

  it('should allow adding custom locators', function() {
    var findMenuItem = function() {
      var itemName = arguments[0];
      var using = arguments[1]; // unused
      var menu = document.querySelectorAll('.menu li');
      for (var i = 0; i < menu.length; ++i) {
        if (menu[i].textContent == itemName) {
          return [menu[i]];
        }
      }
    };

    by.addLocator('menuItem', findMenuItem);

    expect(by.menuItem).toBeDefined();

    browser.get('index.html');
    expect(element(by.menuItem('repeater')).isPresent());
    expect(element(by.menuItem('repeater')).getText()).toEqual('repeater');
  });

  it('should allow adding custom varargs locators', function() {
    var findMenuItemWithName = function() {
      var css = arguments[0];
      var itemName = arguments[1];
      var using = arguments[2]; // unused
      var menu = document.querySelectorAll(css);
      for (var i = 0; i < menu.length; ++i) {
        if (menu[i].textContent == itemName) {
          return [menu[i]];
        }
      }
    };

    by.addLocator('menuItemWithName', findMenuItemWithName);

    expect(by.menuItemWithName).toBeDefined();

    browser.get('index.html');
    expect(element(by.menuItemWithName('.menu li', 'repeater')).isPresent());
    expect(element(by.menuItemWithName('.menu li', 'repeater')).getText()).toEqual('repeater');
  });

  describe('helper functions', function() {
    it('should get the absolute URL', function() {
      browser.get('index.html');
      expect(browser.getLocationAbsUrl()).
          toEqual('http://localhost:'+port+'/index.html#/form');

      element(by.linkText('repeater')).click();
      expect(browser.getLocationAbsUrl()).
          toEqual('http://localhost:'+port+'/index.html#/repeater');
    });

    it('should navigate to another url with setLocation', function() {
      browser.get('index.html');

      browser.setLocation('/repeater');

      expect(browser.getLocationAbsUrl()).
        toEqual('http://localhost:' + port + '/index.html#/repeater');
    });
  });
});
