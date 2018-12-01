describe('success spec', () => {
  it('should pass', async () => {
    await browser.get('index.html');
    const greeting = element(by.binding('greeting'));
    expect(await greeting.getText()).toEqual('Hiya');
  });
});
