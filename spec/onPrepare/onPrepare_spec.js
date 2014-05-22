describe('onPrepare function in the config', function() {
  it('should have a special variable set in onPrepare', function() {
    expect(browser.params.password).toEqual('12345');
  });
});
