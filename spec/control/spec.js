describe('protractor control flow', () => {
  it('should not deadlock', async() => {
    await browser.driver.wait(() => {
      return true;
    }, 1000);
    expect(true).toEqual(true);
  });
});
