describe('Browser', function() {

  var newBrowser;

  afterEach(function(done) {
    // Calling quit will remove the browser.
    // You can choose to not quit the browser, and protractor will quit all of
    // them for you when it exits (i.e. if you need a static number of browsers
    // throughout all of your tests). However, I'm forking browsers in my tests
    // and don't want to pile up my browser count.
    if (newBrowser) {
      newBrowser.quit().then(() => {
        done();
      });
    } else {
      done();
    }
  });

  it('should be able to fork', function() {
    browser.get('index.html');
    newBrowser = browser.forkNewDriverInstance();
    expect(newBrowser).not.toEqual(browser);
    expect(newBrowser.driver).not.toEqual(browser.driver);
    expect(newBrowser.driver.getCurrentUrl()).toEqual('data:,');
  });

  it('should be able to navigate to same url on fork', function() {
    browser.get('index.html');
    newBrowser = browser.forkNewDriverInstance(true);
    expect(newBrowser.driver.getCurrentUrl()).
        toMatch('index.html#/form');
  });

  it('should be able to copy mock modules on fork', function() {
    var mockModule = function() {
      var newModule = angular.module('mockModule', []);
      newModule.value('version', '2');
    };

    browser.addMockModule('mockModule', mockModule);
    browser.get('index.html');

    newBrowser = browser.forkNewDriverInstance(true, true);
    expect(newBrowser.element(by.css('[app-version]')).getText()).toEqual('2');
  });


  describe('Multiple browsers', function() {

    var Person = function(name, browser) {
      var $ = browser.$;
      var element = browser.element;

      this.openApp = function() {
        browser.get('index.html#/interaction');
      };

      this.login = function() {
        element(by.model('userInput')).sendKeys(name);
        $('#sendUser').click();
      };

      this.clearMessages = function() {
        $('#clearMessages').click();
      };

      this.sendMessage = function(msg) {
        element(by.model('message')).sendKeys(msg);
        $('#sendMessage').click();
      };

      this.getMessages = function() {
        return element.all(by.repeater('msg in messages track by $index'));
      };
    };

    var p0, p1;

    beforeEach(function() {
      // default browser.
      p0 = new Person('p0', browser);
      p0.openApp();
      p0.login();
      p0.clearMessages();

      // Any additional browsers can be instantiated via browser.forkNewDriverInstance().
      newBrowser = browser.forkNewDriverInstance(true);
      p1 = new Person('p1', newBrowser);
      p1.openApp();
      p1.login();
    });

    it('should be able to interact', function() {
      expect(p0.getMessages().count()).toEqual(0);

      p0.sendMessage('p0');
      browser.sleep(100); // The app polls every 100ms for updates.
      expect(p0.getMessages().count()).toEqual(1);
      expect(p1.getMessages().count()).toEqual(1);

      p1.sendMessage('p1');
      browser.sleep(100); // The app polls every 100ms for updates.
      expect(p0.getMessages().count()).toEqual(2);
      expect(p1.getMessages().count()).toEqual(2);
    });

    it('should perform actions in sync', function() {
      var ACTIONS = 10;
      expect(p0.getMessages().count()).toEqual(0);

      var expectedMessages = [];
      var i;
      for (i = 0; i < ACTIONS; ++i) {
        p0.sendMessage(i);
        expectedMessages.push('p0: ' + i);
      }
      for (i = 0; i < ACTIONS; ++i) {
        p1.sendMessage(i);
        expectedMessages.push('p1: ' + i);
      }
      for (i = 0; i < ACTIONS; ++i) {
        p0.sendMessage(i);
        p1.sendMessage(i);
        expectedMessages.push('p0: ' + i);
        expectedMessages.push('p1: ' + i);
      }

      browser.sleep(100); // The app polls every 100ms for updates.
      expect(p0.getMessages().getText()).toEqual(expectedMessages);
      expect(p1.getMessages().getText()).toEqual(expectedMessages);
    });
  });
});
