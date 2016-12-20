describe('async angular1/2 hybrid using ngUpgrade application', function() {
  describe('@angular/upgrade/static', function() {
    it('should be able to click buttons and wait for $timeout', function() {
      browser.get('/upgrade');

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

    it('should be able to automatically infer ng1/ng2/ngUpgrade', function() {
      browser.get('/upgrade');
      expect($('h1').getText()).toBe('My App');
      browser.get('/ng1');
      expect($$('h4').first().getText()).toBe('Bindings');
      browser.get('/upgrade');
      expect($('h1').getText()).toBe('My App');
      browser.get('/ng2');
      expect($('h1').getText()).toBe('Test App for Angular 2');
      browser.get('/upgrade');
      expect($('h1').getText()).toBe('My App');
    });
  });

  describe('@angular/upgrade (not static)', function() {
    it('should be able to click buttons and wait for $timeout', function() {
      browser.get('/upgrade?no_static');

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
});
