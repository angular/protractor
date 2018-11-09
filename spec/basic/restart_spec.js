describe('browser.restart', () => {
  it('doesn\'t break ignoreSynchronization', async () => {
    await browser.get('index.html#/polling');
    await browser.restart();

    browser.ignoreSynchronization = true;
    // Get a non-angular page. It shouldn't fail if ignoreSynchronization is on.
    await browser.get('https://google.com/');
  });

  afterAll(() => {
    browser.ignoreSynchronization = false;
  });
});
