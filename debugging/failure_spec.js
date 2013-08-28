var webdriver = require('selenium-webdriver');


describe('modes of failure', function() {
  ptor = protractor.getInstance();

  it('should fail to find a non-existent element', function() {
    ptor.get('app/index.html#/form');

    // Run this statement before the line which fails. If protractor is run
    // with the debugger (protractor debug debugging/conf.js), the test
    // will pause after loading the webpage but before trying to find the
    // element.
    ptor.debugger();

    // This element doesn't exist, so this fails.
    var nonExistant = ptor.findElement(protractor.By.binding('nopenopenope'));
  });

  it('should fail to use protractor on a non-Angular site', function() {
    ptor.get('http://www.google.com');
  }, 20000);

  it('should fail an assertion', function() {
    ptor.get('app/index.html#/form');

    var greeting = ptor.findElement(protractor.By.binding('{{greeting}}'));

    expect(greeting.getText()).toEqual('This is not what it equals');
  });
});
