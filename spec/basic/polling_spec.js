/**
 * These tests show how to turn off Protractor's synchronization
 * when using applications which poll with $http or $timeout.
 * A better solution is to switch to the angular $interval service if possible.
 */
describe('synchronizing with pages that poll', () => {
  beforeEach(async () => {
    await browser.get('index.html#/polling');
  });

  it('avoids timeouts using waitForAngularEnabled set to false', async () => {
    const startButton = element(by.id('pollstarter'));
    
    const count = element(by.binding('count'));
    expect(await count.getText()).toEqual('0');

    await startButton.click();

    // Turn this on to see timeouts.
    await browser.waitForAngularEnabled(false);

    const textBefore = await count.getText();
    expect(textBefore).toBeGreaterThan(-1);

    await browser.sleep(2000);

    const textAfter = await count.getText();
    expect(textAfter).toBeGreaterThan(1);
  });

  it('avoids timeouts using waitForAngularEnabled', async () => {
    const startButton = element(by.id('pollstarter'));

    const count = element(by.binding('count'));
    expect(await count.getText()).toEqual('0');

    await startButton.click();

    // Turn this off to see timeouts.
    await browser.waitForAngularEnabled(false);

    expect(await browser.waitForAngularEnabled()).toBeFalsy();

    const textBefore = await count.getText();
    expect(textBefore).toBeGreaterThan(-1);

    await browser.sleep(2000);

    const textAfter = await count.getText();
    expect(textAfter).toBeGreaterThan(1);
  });

  afterEach(async () => {
    // Remember to turn it back on when you're done!
    await browser.waitForAngularEnabled(true);
  });
});
