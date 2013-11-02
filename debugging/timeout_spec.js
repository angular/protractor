describe('timeout possibilities', function() {
  jasmine.getEnv().defaultTimeoutInterval = 33;


  it('shoud pass - first test should not timeout', function() {
    expect(true).toEqual(true);
  });

  it('should timeout due to webdriver script timeout', function() {
    browser.driver.manage().timeouts().setScriptTimeout(55);

    browser.get('index.html#/form');

    browser.driver.executeAsyncScript(function() {
      var callback = arguments[arguments.length - 1];
      setTimeout(callback, 500);
    });

    expect(element(by.binding('greeting')).getText()).
        toEqual('Hiya');
  }, 5000); // The 5000 here sets the Jasmine spec timeout.

  it('should fail normally', function() {
    expect(false).toEqual(true);
  });

  it('should pass - tests in the middle should be unaffected', function() {
    expect(true).toEqual(true);
  });

  describe('waitForAngular', function() {
    it('should timeout and give a reasonable message', function() {

      browser.driver.manage().timeouts().setScriptTimeout(55);

      browser.get('index.html#/async');


      var status = element(by.binding('slowHttpStatus'));
      var button = element(by.css('[ng-click="slowHttp()"]'));

      expect(status.getText()).toEqual('not started');

      button.click();

      expect(status.getText()).toEqual('done');
    }, 5000); // The 5000 here sets the Jasmine spec timeout.
  });

  it('should timeout due to Jasmine spec timeout', function() {
    browser.driver.sleep(1000);
    expect(true).toBe(true);
  });

  it('should pass - previous timeouts should not affect this', function() {
    expect(true).toEqual(true);
  });
});
