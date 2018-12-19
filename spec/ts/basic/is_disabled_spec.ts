import {promise as wdpromise} from '../../..';

describe('verify control flow is off', () => {
  it('should have set webdriver.promise.USE_PROMISE_MANAGER', () => {
    expect((wdpromise as any).USE_PROMISE_MANAGER).toBe(false);
  });
});
