describe('async angular1/2 hybrid using ngUpgrade application', function() {
  beforeEach(function() {
    browser.get('/hybrid');
  });

  it('should set browser flag via config', function() {
    expect(browser.ng12Hybrid).toBe(true);
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

  it('should use the flag on the browser object', function() {
    browser.ng12Hybrid = false;
    browser.get('/ng2'); // will time out if Protractor expects hybrid
    browser.ng12Hybrid = true;
  });
});
