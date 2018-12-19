describe('no protractor at all', () => {
  it('should still do normal tests', () => {
    expect(true).toBe(true);
  });
});

describe('protractor library', () => {
  it('should expose the correct global variables', () => {
    expect(protractor).toBeDefined();
    expect(browser).toBeDefined();
    expect(by).toBeDefined();
    expect(By).toBeDefined();
    expect(element).toBeDefined();
    expect($).toBeDefined();
    expect(DartObject).toBeDefined();
    const obj = {};
    const dartProxy = new DartObject(obj);
    expect(dartProxy.o === obj).toBe(true);
  });

  it('should export other webdriver classes onto the global protractor',
      () => {
        // TODO(selenium4): Actions API missing from typings.
        // expect(protractor.Actions).toBeDefined();
        expect(protractor.Key.RETURN).toEqual('\uE006');
      });

  it('should export custom parameters to the protractor instance', () => {
    expect(browser.params.login).toBeDefined();
    expect(browser.params.login.user).toEqual('Jane');
    expect(browser.params.login.password).toEqual('1234');
  });

  it('should allow a mix of using protractor and using the driver directly',
      async() => {
    await browser.get('index.html');
    expect(await browser.getCurrentUrl()).toMatch('#/form');

    await browser.driver.findElement(protractor.By.linkText('repeater')).click();
    expect(await browser.driver.getCurrentUrl()).toMatch('#/repeater');

    await browser.navigate().back();
    expect(await browser.driver.getCurrentUrl()).toMatch('#/form');
  });

  it('should have access to the processed config block', async() => {
    let containsMatching = (arr, string) => {
      let contains = false;
      for (let i = 0; i < arr.length; ++i) {
        if (arr[i].indexOf(string) !== -1) {
          contains = true;
        }
      }
      return contains;
    }

    const config = await browser.getProcessedConfig();
    expect(config.params.login).toBeDefined();
    expect(config.params.login.user).toEqual('Jane');
    expect(config.params.login.password).toEqual('1234');
    expect(containsMatching(config.specs, 'lib_spec.js')).toBe(true);
    expect(config.capabilities).toBeDefined();
  });

  it('should allow adding custom locators', async() => {
    let findMenuItem = () => {
      const itemName = arguments[0];
      const menu = document.querySelectorAll('.menu li');
      for (const i = 0; i < menu.length; ++i) {
        if (menu[i].textContent == itemName) {
          return [menu[i]];
        }
      }
    };

    by.addLocator('menuItem', findMenuItem);

    expect(by.menuItem).toBeDefined();

    await browser.get('index.html');
    expect(await element(by.menuItem('repeater')).isPresent());
    expect(await element(by.menuItem('repeater')).getText()).toEqual('repeater');
  });

  it('should allow adding custom varargs locators', async() => {
    let findMenuItemWithName = function() {
      const css = arguments[0];
      const itemName = arguments[1];
      const menu = document.querySelectorAll(css);
      for (const i = 0; i < menu.length; ++i) {
        if (menu[i].textContent == itemName) {
          return [menu[i]];
        }
      }
    };

    by.addLocator('menuItemWithName', findMenuItemWithName);

    expect(by.menuItemWithName).toBeDefined();

    await browser.get('index.html');
    expect(await element(by.menuItemWithName('.menu li', 'repeater')).isPresent());
    expect(await element(by.menuItemWithName('.menu li', 'repeater')).getText())
        .toEqual('repeater');
  });

  describe('helper functions', () => {
    it('should get the absolute URL', async() => {
      await browser.get('index.html');
      expect(await browser.getLocationAbsUrl()).toMatch('/form');

      await element(by.linkText('repeater')).click();
      expect(await browser.getLocationAbsUrl()).toMatch('/repeater');
    });

    it('should navigate to another url with setLocation', async() => {
      await browser.get('index.html');

      await browser.setLocation('/repeater');

      expect(await browser.getLocationAbsUrl()).toMatch('/repeater');
    });
  });
});
