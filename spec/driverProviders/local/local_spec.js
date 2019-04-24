describe('local driver provider', () => {
  const URL = '/ng2/#/async';

  it('should get a page and find an element', async() => {
    await browser.get(URL);
    const increment = $('#increment');
    expect(await increment.isPresent()).toBeDefined();
  });

  it('should get a forked instance, and find an element', async() => {
    await browser.get(URL);
    const browser2 = await browser.forkNewDriverInstance();
    await browser2.get(URL);
    const increment = browser2.$('#increment');
    expect(await increment.isPresent()).toBeDefined();
  });
});
