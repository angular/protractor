describe('handling timeout errors', () => {

  // beforeEach(async () => {
  //   await browser.waitForAngularEnabled(false);
  // });

  // afterEach(async () => {
  //   await browser.waitForAngularEnabled(true);
  // });

  it('should call error handler on a timeout', async () => {
    try {
      await browser.get('http://dummyUrl', 1);
      throw 'did not handle error';
    } catch (err) {
      expect(err instanceof Error).toBeTruthy();
    }
  });
});
