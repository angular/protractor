import {browser} from 'protractor';
import {WebDriver} from 'selenium-webdriver';

describe('browser', () => {
  let session1: string;
  let session2: string;

  afterEach(() => {
    browser.restart();
  });
  
  it('should load a browser session', (done) => {
    browser.get('http://angularjs.org');
    browser.getSession().then(session => {
      session1 = session.getId();
      expect(session1).not.toBeUndefined();
    }).catch(err => {
      done.fail('session should be defined');
    });
    done();
  });
  it('should have a new browser session', (done) => {
    browser.get('http://angularjs.org');
    browser.getSession().then(session => {
      session2 = session.getId();
      expect(session2).not.toBeUndefined();
      expect(session1).not.toEqual(session2);
    }).catch(err => {
      done.fail('session should be defined');
    });
    done();
  });
});
