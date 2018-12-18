describe('browser.restart', () => {
  it(`doesn't break waitForAngularEnabled set to false`, async () => {
    await browser.get('index.html#/polling');
    await browser.restart();

    await browser.waitForAngularEnabled(false);
    // Get a non-angular page. It shouldn't fail if waitForAngularEnabled
    // is turned off.
    await browser.get('https://google.com/');
  });

  afterAll(async () => {
    await browser.waitForAngularEnabled(true);
  });
});
