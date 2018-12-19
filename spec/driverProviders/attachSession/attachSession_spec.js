describe('selenium session id', () => {
  const URL = '/ng2/#/async';

  beforeEach(async () => {
    await browser.get(URL);
  });

  it('should be able to use an existing session', async () => {
    const incrementButton = element.all(by.css('button.action')).get(0);
    const incrementValue = element.all(by.css('span.val')).get(0);
    await incrementButton.click();
    expect(await incrementValue.getText()).toBe('1');
  });
});
