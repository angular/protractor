describe('selenium session id', () => {
  var URL = '/ng2/#/async';

  beforeEach(async () => {
    await browser.get(URL);
  });
  it('should be able to use an existing session', () => {
    var increment = $('#increment');
    expect(increment).toBeDefined();
  });
});
