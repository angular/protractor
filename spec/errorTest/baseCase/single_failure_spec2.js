describe('single failure spec2', () => {
  it('should fail expectation', async () => {
    await browser.get('index.html');
    const greeting = element(by.binding('greeting'));
    expect(await greeting.getText()).toEqual('INTENTIONALLY INCORRECT');
  });
});
