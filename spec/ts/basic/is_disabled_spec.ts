import {browser, promise as ppromise} from '../../..';

describe('verify control flow is off', function() {
  it('should have set webdriver.promise.USE_PROMISE_MANAGER', () => {
    expect((ppromise as any).USE_PROMISE_MANAGER).toBe(false);
  });

  it('should not wait on one command before starting another', async function() {
    // Wait forever
    browser.controlFlow().wait(
        (browser.controlFlow() as any).promise((): void => undefined) as ppromise.Promise<void>);

    // then return
    await browser.controlFlow().execute(() => ppromise.when(null));
  });
});
