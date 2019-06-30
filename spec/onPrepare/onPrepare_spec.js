describe('onPrepare function in the config', () => {
  it('should have a special variable set in onPrepare', () => {
    expect(browser.params.password).toEqual('12345');
  });
});
