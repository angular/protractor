describe('timeout spec', () => {
  it('should timeout due to jasmine spec limit', async () => {
    await browser.get('index.html#/form');
  }, 1);
});
