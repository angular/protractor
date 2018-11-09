describe('mock modules', () => {
  // A module to override the 'version' service. This function will be
  // executed in the context of the application under test, so it may
  // not refer to any local variables.
  const mockModuleA = () => {
    let newModule = angular.module('moduleA', []);
    newModule.value('version', '2');
  };

  // A second module overriding the 'version' service.
  // This module shows the use of a string for the load
  // function.
  const mockModuleB = `angular.module('moduleB', []).value('version', '3');`;

  // A third module overriding the 'version' service. This function
  // references the additional arguments provided through addMockModule().
  const mockModuleC = () => {
    var newModule = angular.module('moduleC', []);
    newModule.value('version', arguments[0] + arguments[1]);
  };

  afterEach(() => {
    browser.clearMockModules();
  });

  it('should override services via mock modules', async() => {
    browser.addMockModule('moduleA', mockModuleA);

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should have the version of the last loaded module', async() => {
    browser.addMockModule('moduleA', mockModuleA);
    browser.addMockModule('moduleB', mockModuleB);

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('3');
  });

  it('should use the latest module if two are added with the same name',
      async() => {
    browser.addMockModule('moduleA', mockModuleA);

    let mockModuleA2 = () => {
      let newModule = angular.module('moduleA', []);
      newModule.value('version', '3');
    };

    browser.addMockModule('moduleA', mockModuleA2);

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('3');
  });

  it('should have the version of the module A after deleting module B',
      async() => {
    browser.addMockModule('moduleA', mockModuleA);
    browser.addMockModule('moduleB', mockModuleB);

    browser.removeMockModule('moduleB');

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should remove duplicate mock modules', async() => {
    browser.addMockModule('moduleA', mockModuleA);
    browser.addMockModule('moduleA', mockModuleA);
    browser.removeMockModule('moduleA');

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('0.1');
  });

  it('should be a noop to remove a module which does not exist', async() => {
    browser.addMockModule('moduleA', mockModuleA);
    browser.removeMockModule('moduleB');

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('2');
  });

  it('should have the version provided from parameters through Module C',
      async() => {
    browser.addMockModule('moduleC', mockModuleC, '42', 'beta');

    await browser.get('index.html');

    expect(await element(by.css('[app-version]')).getText()).toEqual('42beta');
  });

  it('should retrieve a list of current mock modules', () => {
    browser.addMockModule('moduleA', mockModuleA);
    browser.addMockModule('moduleC', mockModuleC, '2', 'B');

    // Should have 3 mock modules, A, C, and the base.
    expect(browser.getRegisteredMockModules().length).toBe(3);
    expect(browser.getRegisteredMockModules()[1]).toEqual(mockModuleA);
    expect(browser.getRegisteredMockModules()[2]).toEqual(mockModuleC);
  });

  it('should load mock modules after refresh', async() => {
    browser.addMockModule('moduleA', mockModuleA);

    await browser.get('index.html');
    expect(await element(by.css('[app-version]')).getText()).toEqual('2');

    await browser.navigate().refresh();
    expect(await element(by.css('[app-version]')).getText()).toEqual('2');
  });

  // Back and forward do NOT work at the moment because of an issue
  // bootstrapping with Angular
  /*
  it('should load mock modules after navigating back and forward', () => {
    browser.addMockModule('moduleA', mockModuleA);

    browser.get('index.html');
    expect(element(by.css('[app-version]')).getText()).toEqual('2');

    browser.get('index.html#/repeater');
    expect(element(by.css('[app-version]')).getText()).toEqual('2');

    browser.navigate().back();
    expect(element(by.css('[app-version]')).getText()).toEqual('2');

    browser.navigate().forward();
    expect(element(by.css('[app-version]')).getText()).toEqual('2');
  });
  */

  it('should load mock modules after navigating back and forward from link', 
      async() => {
    const caps = await browser.getCapabilities();
    if (caps.get('browserName') === 'safari') {
      // Safari can't handle navigation. Ignore this test.
      return;
    } else {
      browser.addMockModule('moduleA', mockModuleA);

      await browser.get('index.html');
      expect(await element(by.css('[app-version]')).getText()).toEqual('2');

      await element(by.linkText('repeater')).click();
      expect(await element(by.css('[app-version]')).getText()).toEqual('2');

      await browser.navigate().back();
      expect(await element(by.css('[app-version]')).getText()).toEqual('2');

      await browser.navigate().forward();
      expect(await element(by.css('[app-version]')).getText()).toEqual('2');
    }
  });
});
