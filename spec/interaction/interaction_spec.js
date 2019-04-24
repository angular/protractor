class Person {

  constructor(name, browser) {
    this.name = name;
    this.browser = browser;
    this.$ = browser.$;
    this.element = browser.element;
  }

  async openApp() {
    await this.browser.get('index.html#/interaction');
  };

  async login() {
    await this.element(by.model('userInput')).sendKeys(this.name);
    await this.$('#sendUser').click();
  };

  async clearMessages() {
    await this.$('#clearMessages').click();
  };

  async sendMessage(msg) {
    await this.element(by.model('message')).sendKeys(msg);
    await this.$('#sendMessage').click();
  };

  getMessages() {
    return this.element.all(by.repeater('msg in messages track by $index'));
  };
};

describe('Browser', () => {

  let newBrowser;

  afterEach(async() => {
    // Calling quit will remove the browser.
    // You can choose to not quit the browser, and protractor will quit all of
    // them for you when it exits (i.e. if you need a static number of browsers
    // throughout all of your tests). However, I'm forking browsers in my tests
    // and don't want to pile up my browser count.
    if (newBrowser) {
      await newBrowser.quit();
    }
  });

  it('should be able to fork', async() => {
    await browser.get('index.html');
    newBrowser = await browser.forkNewDriverInstance();
    expect(newBrowser).not.toEqual(browser);
    expect(newBrowser.driver).not.toEqual(browser.driver);
    expect(await newBrowser.driver.getCurrentUrl()).toEqual('data:,');
  });

  it('should be able to navigate to same url on fork', async() => {
    await browser.get('index.html');
    newBrowser = await browser.forkNewDriverInstance(true);
    expect(await newBrowser.driver.getCurrentUrl()).toMatch('index.html#/form');
  });

  it('should be able to copy mock modules on fork', async() => {
    const mockModule = () => {
      const newModule = angular.module('mockModule', []);
      newModule.value('version', '2');
    };

    browser.addMockModule('mockModule', mockModule);
    await browser.get('index.html');

    newBrowser = await browser.forkNewDriverInstance(true, true);
    expect(await newBrowser.element(by.css('[app-version]')).getText())
        .toEqual('2');
  });


  describe('Multiple browsers', () => {
    let p0, p1;

    beforeEach(async() => {
      // default browser.
      p0 = new Person('p0', browser);
      await p0.openApp();
      await p0.login();
      await p0.clearMessages();

      // Any additional browsers can be instantiated via browser.forkNewDriverInstance().
      newBrowser = await browser.forkNewDriverInstance(true);
      p1 = new Person('p1', newBrowser);
      await p1.openApp();
      await p1.login();
    });

    it('should be able to interact', async() => {
      expect(await p0.getMessages().count()).toEqual(0);

      await p0.sendMessage('p0');
      await browser.sleep(100); // The app polls every 100ms for updates.
      expect(await p0.getMessages().count()).toEqual(1);
      expect(await p1.getMessages().count()).toEqual(1);

      await p1.sendMessage('p1');
      await browser.sleep(100); // The app polls every 100ms for updates.
      expect(await p0.getMessages().count()).toEqual(2);
      expect(await p1.getMessages().count()).toEqual(2);
    });

    it('should perform actions in sync', async() => {
      const ACTIONS = 10;
      expect(await p0.getMessages().count()).toEqual(0);

      let expectedMessages = [];
      let i;
      for (i = 0; i < ACTIONS; ++i) {
        await p0.sendMessage(i);
        expectedMessages.push('p0: ' + i);
      }
      for (i = 0; i < ACTIONS; ++i) {
        await p1.sendMessage(i);
        expectedMessages.push('p1: ' + i);
      }
      for (i = 0; i < ACTIONS; ++i) {
        await p0.sendMessage(i);
        await p1.sendMessage(i);
        expectedMessages.push('p0: ' + i);
        expectedMessages.push('p1: ' + i);
      }

      await browser.sleep(100); // The app polls every 100ms for updates.
      expect(await p0.getMessages().getText()).toEqual(expectedMessages);
      expect(await p1.getMessages().getText()).toEqual(expectedMessages);
    });
  });
});
