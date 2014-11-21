var util = require('util');

var Person = function(name, browser) {
  var self = this;
  var $ = browser.$;
  var $$ = browser.$$;
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
    return element.all(by.repeater("msg in messages track by $index"));
  };
};

describe('Multiple browsers', function() {

  // default browser.
  var browser1 = browser;
  var p0 = new Person('p0', browser1);
  // Any additional browsers can be instantiated via global createBrowser().
  var browser2 = createBrowser();
  var p1 = new Person('p1', browser2);

  beforeEach(function() {
    p0.openApp();
    p0.login();
    p1.openApp();
    p1.login();
    p1.clearMessages();
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
