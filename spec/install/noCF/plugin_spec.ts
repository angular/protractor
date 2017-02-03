import {browser, protractor} from 'protractor';

describe('category', function() {
  it('name', async function() {
    await browser.get('index.html');
    await expect((protractor as any).ON_PAGE_LOAD).toBe(true);
  });
});
