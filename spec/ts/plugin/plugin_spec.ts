import {browser, protractor} from '../../..';

describe('plugins', () => {
  it('should have run the onPageLoad hook', async() => {
    await browser.get('index.html');
    expect((protractor as any).ON_PAGE_LOAD).toBe(true);
  });
});
