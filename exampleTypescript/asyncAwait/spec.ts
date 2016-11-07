// See README.md for important details.
import {browser, element, by, By, $, $$, ExpectedConditions} from 'protractor';

describe('async function', function() {
  it('should wait on async function in conditional', async function() : Promise<any> {
    browser.get('http://www.angularjs.org');
    let todoList = element.all(by.repeater('todo in todoList.todos'));
    if ((await todoList.count()) > 1) {
      expect((await todoList.get(1).getText())).toEqual('build an angular app');
    }
  });
});
