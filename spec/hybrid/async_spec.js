describe('async angular1/2 hybrid using ngUpgrade application', function() {
  beforeEach(function() {
    browser.ng12Hybrid = true;
    // TODO(sjelin): Fix this when properly loading a hybrid page works again.
    // Should just be able to use `browser.get` and remove the sleep statement.
    browser.driver.get(browser.baseUrl + '/hybrid');
    browser.sleep(3000);
  });

  afterEach(function() {
    browser.ng12Hybrid = false;
  });

  it('should propertly load the page', function() {
    expect($('h1').getText()).toEqual('My App');
  });

  it('should be able to click buttons and wait for $timeout', function() {
    var rootBtn = $$('my-app button').first();
    expect(rootBtn.getText()).toEqual('Click Count: 0');
    rootBtn.click();
    expect(rootBtn.getText()).toEqual('Click Count: 1');

    var ng2Btn = $$('ng2 button').first();
    expect(ng2Btn.getText()).toEqual('Click Count: 0');
    ng2Btn.click();
    expect(ng2Btn.getText()).toEqual('Click Count: 1');

    var ng1Btn = $('ng1 button');
    expect(ng1Btn.getText()).toEqual('Click Count: 0');
    ng1Btn.click();
    expect(ng1Btn.getText()).toEqual('Click Count: 1');
  });
});
