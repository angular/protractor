describe('timeout possibilities', function() {
  ptor = protractor.getInstance();
  jasmine.getEnv().defaultTimeoutInterval = 33;


  it('shoud pass - first test should not timeout', function() {
    expect(true).toEqual(true);
  });

  it('should timeout due to webdriver script timeout', function() {
    ptor.driver.manage().timeouts().setScriptTimeout(55);

    ptor.get('app/index.html#/form');

    ptor.driver.executeAsyncScript(function() {
      var callback = arguments[arguments.length - 1];
      setTimeout(callback, 500);
    });

    expect(ptor.findElement(protractor.By.binding('greeting')).getText()).
        toEqual('Hiya');
  }, 5000); // The 5000 here sets the Jasmine spec timeout.

  it('should fail normally', function() {
    expect(false).toEqual(true);
  });

  it('should pass - tests in the middle should be unaffected', function() {
    expect(true).toEqual(true);
  });

  it('should timeout due to Jasmine spec timeout', function() {
    ptor.driver.sleep(1000);
    expect(true).toBe(true);
  });

  it('should pass - previous timeouts should not affect this', function() {
    expect(true).toEqual(true);
  });
});
