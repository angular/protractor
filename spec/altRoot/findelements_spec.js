describe('finding elements when ng-app is nested', () => {
  beforeEach(async() => {
    await browser.get('alt_root_index.html#/form');
  });

  it('should find an element by binding', async() => {
    const greeting = element(by.binding('{{greeting}}'));

    expect(await greeting.getText()).toEqual('Hiya');
  });

  it('should find elements outside of angular', async() => {
    const outside = element(by.id('outside-ng'));
    const inside = element(by.id('inside-ng'));

    expect(await outside.getText()).toEqual('{{1 + 2}}');
    expect(await inside.getText()).toEqual('3');
  });
});
