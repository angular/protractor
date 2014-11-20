var util = require('util');

var Person = function(index) {
  var self = this;
  this.index = index;

  this.switchDriver = function() {
    browser.switchToDriver(self.index).then(function() {console.log('switched user to', self.index)});
  };

  this.openApp = function() {
    self.switchDriver();
    browser.get('index.html#/interaction').then(function(){console.log('opened app for', self.index)});
  };

  this.login = function() {
    self.switchDriver();
    element(by.model('userInput')).sendKeys('p' + self.index).then(function(){console.log('sent keys for', self.index)});
    $('#sendUser').click().then(function(){console.log('clicked for', self.index)});;
  };

  this.clearMessages = function() {
    self.switchDriver();
    $('#clearMessages').click();
  };

  this.sendMessage = function(msg) {
    self.switchDriver();
    element(by.model('message')).sendKeys(msg);
    $('#sendMessage').click();
  };

  this.getMessages = function() {
    self.switchDriver();
    return element.all(by.repeater("msg in messages track by $index"));
  };
}

describe('Multiple browsers', function() {

  var p0 = new Person(0);
  var p1 = new Person(1);

  beforeEach(function() {
    p0.openApp();
    p0.login();
    p1.openApp();
    p1.login();
    // p1.clearMessages();
  });

  it('should be able to interact', function() {
    // expect(p0.getMessages().count()).toEqual(0);

    // p0.sendMessage('p0');
    // expect(p0.getMessages().count()).toEqual(1);
    // expect(p1.getMessages().count()).toEqual(1);

    // p1.sendMessage('p1');
    // expect(p0.getMessages().count()).toEqual(2);
    // expect(p1.getMessages().count()).toEqual(2);
  });

  xit('should perform actions in sync', function() {
    var ACTIONS = 10;
    expect(p0.getMessages().count()).toEqual(0);

    var expectedMessages = [];
    for (var i = 0; i < ACTIONS; ++i) {
      p0.sendMessage(i);
      expectedMessages.push('p0: ' + i);
    };
    for (var i = 0; i < ACTIONS; ++i) {
      p1.sendMessage(i);
      expectedMessages.push('p1: ' + i);
    };
    for (var i = 0; i < ACTIONS; ++i) {
      p0.sendMessage(i);
      p1.sendMessage(i);
      expectedMessages.push('p0: ' + i);
      expectedMessages.push('p1: ' + i);
    };

    expect(p0.getMessages()).toEqual(expectedMessages);
    expect(p1.getMessages()).toEqual(expectedMessages);
  });

});
