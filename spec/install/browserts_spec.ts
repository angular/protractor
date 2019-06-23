import {browser} from 'protractor';
import {WebDriver} from 'selenium-webdriver';

describe('browser', () => {
  let session1: string;
  let session2: string;

  afterEach(async () => {
    await browser.restart();
  });
  
  it('should load a browser session', async () => {
    await browser.get('http://angularjs.org');
    const session = await browser.getSession();
    session1 = session.getId();
    expect(session1).not.toBeUndefined(); 
  });

  it('should have a new browser session', async () => {
    await browser.get('http://angularjs.org');
    const session = await browser.getSession();
    session2 = session.getId();
    expect(session2).not.toBeUndefined();
    expect(session1).not.toEqual(session2);
  });
});
