var util = require('util');

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
    expect(DartObject).toBeDefined();
    var obj = {};
    var dartProxy = new DartObject(obj);
    expect(dartProxy.o === obj).toBe(true);
  });

  it('should export other webdriver classes onto the global protractor',
      function() {
        expect(protractor.ActionSequence).toBeDefined();
        expect(protractor.Key.RETURN).toEqual('\uE006');
      });

  it('should export custom parameters to the protractor instance', function() {
    expect(browser.params.login).toBeDefined();
    expect(browser.params.login.user).toEqual('Jane');
    expect(browser.params.login.password).toEqual('1234');
  });

  it('should allow a mix of using protractor and using the driver directly',
      function() {
        browser.get('index.html');
        expect(browser.getCurrentUrl()).toMatch('#/form');

        browser.driver.findElement(protractor.By.linkText('repeater')).click();
        expect(browser.driver.getCurrentUrl()).toMatch('#/repeater');

        browser.navigate().back();
        expect(browser.driver.getCurrentUrl()).toMatch('#/form');
      });

  it('should have access to the processed config block', function() {
    function containsMatching(arr, string) {
      var contains = false;
      for (var i = 0; i < arr.length; ++i) {
        if (arr[i].indexOf(string) !== -1) {
          contains = true;
        }
      }
      return contains;
    }

    browser.getProcessedConfig().then(function(config) {
      expect(config.params.login).toBeDefined();
      expect(config.params.login.user).toEqual('Jane');
      expect(config.params.login.password).toEqual('1234');
      expect(containsMatching(config.specs, 'lib_spec.js')).toBe(true);
      expect(config.capabilities).toBeDefined();
    });
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
    expect(element(by.menuItemWithName('.menu li', 'repeater')).getText()).
        toEqual('repeater');
  });

  describe('helper functions', function() {
    it('should get the absolute URL', function() {
      browser.get('index.html');
      expect(browser.getLocationAbsUrl()).
          toMatch('/form');

      element(by.linkText('repeater')).click();
      expect(browser.getLocationAbsUrl()).
          toMatch('/repeater');
    });

    it('should navigate to another url with setLocation', function() {
      browser.get('index.html');

      browser.setLocation('/repeater');

      expect(browser.getLocationAbsUrl()).
          toMatch('/repeater');
    });
  });
});
