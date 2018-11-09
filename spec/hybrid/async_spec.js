describe('async angular1/2 hybrid using ngUpgrade application', () => {
  describe('@angular/upgrade/static', () => {
    it('should be able to click buttons and wait for $timeout', async () => {
      await browser.get('/upgrade');

      const rootBtn = $$('my-app button').first();
      expect(await rootBtn.getText()).toEqual('Click Count: 0');
      await rootBtn.click();
      expect(await rootBtn.getText()).toEqual('Click Count: 1');

      const ng2Btn = $$('ng2 button').first();
      expect(await ng2Btn.getText()).toEqual('Click Count: 0');
      await ng2Btn.click();
      expect(await ng2Btn.getText()).toEqual('Click Count: 1');

      const ng1Btn = $('ng1 button');
      expect(await ng1Btn.getText()).toEqual('Click Count: 0');
      await ng1Btn.click();
      expect(await ng1Btn.getText()).toEqual('Click Count: 1');
    });

    it('should be able to automatically infer ng1/ng2/ngUpgrade', async () => {
      await browser.get('/upgrade');
      expect(await $('h1').getText()).toBe('My App');
      await browser.get('/ng1');
      expect(await $$('h4').first().getText()).toBe('Bindings');
      await browser.get('/upgrade');
      expect(await $('h1').getText()).toBe('My App');
      await browser.get('/ng2');
      expect(await $('h1').getText()).toBe('Test App for Angular 2');
      await browser.get('/upgrade');
      expect(await $('h1').getText()).toBe('My App');
    });
  });

  describe('@angular/upgrade (not static)', () => {
    it('should be able to click buttons and wait for $timeout', async () => {
      await browser.get('/upgrade?no_static');

      const rootBtn = $$('my-app button').first();
      expect(await rootBtn.getText()).toEqual('Click Count: 0');
      await rootBtn.click();
      expect(await rootBtn.getText()).toEqual('Click Count: 1');

      const ng2Btn = $$('ng2 button').first();
      expect(await ng2Btn.getText()).toEqual('Click Count: 0');
      await ng2Btn.click();
      expect(await ng2Btn.getText()).toEqual('Click Count: 1');

      const ng1Btn = $('ng1 button');
      expect(await ng1Btn.getText()).toEqual('Click Count: 0');
      await ng1Btn.click();
      expect(await ng1Btn.getText()).toEqual('Click Count: 1');
    });
  });
});

describe('async angular1/2 hybrid using downgrade application', () => {
  it('should be able to click buttons and wait for $timeout', async () => {
      await browser.get('/upgrade?downgrade');

      const rootBtn = $$('my-app button').first();
      expect(await rootBtn.getText()).toEqual('Click Count: 0');
      await rootBtn.click();
      expect(await rootBtn.getText()).toEqual('Click Count: 1');

      const ng2Btn = $$('ng2 button').first();
      expect(await ng2Btn.getText()).toEqual('Click Count: 0');
      await ng2Btn.click();
      expect(await ng2Btn.getText()).toEqual('Click Count: 1');
  });
});
