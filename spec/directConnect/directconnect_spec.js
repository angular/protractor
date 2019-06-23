describe('direct connect', () => {
  it('should instantiate and run', async() => {
    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    await browser.get('index.html#/form');

    expect(await name.getText()).toEqual('Anon');

    await usernameInput.clear();
    await usernameInput.sendKeys('Jane');
    expect(await name.getText()).toEqual('Jane');
  });
});
