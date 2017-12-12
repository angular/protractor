// Based off of spec/basic/elements_spec.js
import * as q from 'q';

import {$, $$, browser, by, By, element, ElementArrayFinder, ElementFinder, ExpectedConditions, promise as ppromise, WebElement} from '../../..';

describe('ElementFinder', function() {
  it('should return the same result as browser.findElement', async function() {
    await browser.get('index.html#/form');
    const nameByElement = element(by.binding('username'));

    await expect(nameByElement.getText())
        .toEqual(browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', async function() {
    // These should throw no error before a page is loaded.
    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    await browser.get('index.html#/form');

    await expect(name.getText()).toEqual('Anon');

    await usernameInput.clear();
    await usernameInput.sendKeys('Jane');
    await expect(name.getText()).toEqual('Jane');
  });

  it('should chain element actions', async function() {
    await browser.get('index.html#/form');

    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    await expect(name.getText()).toEqual('Anon');

    await((usernameInput.clear() as any) as ElementFinder).sendKeys('Jane');
    await expect(name.getText()).toEqual('Jane');
  });

  it('should run chained element actions in sequence', function(done: any) {
    // Testing private methods is bad :(
    let els = new ElementArrayFinder(browser, () => {
      return ppromise.when([null as WebElement]);
    });
    let applyAction_: (actionFn: (value: WebElement, index: number, array: WebElement[]) => any) =>
        ElementArrayFinder = (ElementArrayFinder as any).prototype.applyAction_;
    let order: string[] = [];

    let deferredA = q.defer<void>();
    els = applyAction_.call(els, () => {
      return deferredA.promise.then(() => {
        order.push('a');
      });
    });
    let deferredB = q.defer<void>();
    els = applyAction_.call(els, () => {
      return deferredB.promise.then(() => {
        order.push('b');
      });
    });

    deferredB.resolve();
    setTimeout(async function() {
      deferredA.resolve();
      await els;
      expect(order).toEqual(['a', 'b']);
      done();
    }, 100);
  });

  it('chained call should wait to grab the WebElement until a method is called', async function() {
    // These should throw no error before a page is loaded.
    const reused = element(by.id('baz')).element(by.binding('item.reusedBinding'));

    await browser.get('index.html#/conflict');

    await expect(reused.getText()).toEqual('Inner: inner');
    await expect(reused.isPresent()).toBe(true);
  });

  it('should differentiate elements with the same binding by chaining', async function() {
    await browser.get('index.html#/conflict');

    const outerReused = element(by.binding('item.reusedBinding'));
    const innerReused = element(by.id('baz')).element(by.binding('item.reusedBinding'));

    await expect(outerReused.getText()).toEqual('Outer: outer');
    await expect(innerReused.getText()).toEqual('Inner: inner');
  });

  it('should chain deeper than 2', async function() {
    // These should throw no error before a page is loaded.
    const reused =
        element(by.css('body')).element(by.id('baz')).element(by.binding('item.reusedBinding'));

    await browser.get('index.html#/conflict');

    await expect(reused.getText()).toEqual('Inner: inner');
  });

  it('should allow handling errors', async function() {
    await browser.get('index.html#/form');
    try {
      await $('.nopenopenope').getText();

      // The above line should have throw an error. Fail.
      await expect(true).toEqual(false);
    } catch (e) {
      await expect(true).toEqual(true);
    }
  });

  it('should allow handling chained errors', async function() {
    await browser.get('index.html#/form');
    try {
      await $('.nopenopenope').$('furthernope').getText();

      // The above line should have throw an error. Fail.
      await expect(true).toEqual(false);
    } catch (e) {
      await expect(true).toEqual(true);
    }
  });

  it('should keep a reference to the original locator', async function() {
    await browser.get('index.html#/form');

    const byCss = by.css('body');
    const byBinding = by.binding('greet');

    await expect(element(byCss).locator()).toEqual(byCss);
    await expect(element(byBinding).locator()).toEqual(byBinding);
  });

  it('should propagate exceptions', async function() {
    await browser.get('index.html#/form');

    const invalidElement = element(by.binding('INVALID'));
    const successful = invalidElement.getText().then(
        function() {
          return true;
        } as any as (() => ppromise.Promise<void>),
        function() {
          return false;
        } as any as (() => ppromise.Promise<void>));
    await expect(successful).toEqual(false);
  });

  it('should be returned from a helper without infinite loops', async function() {
    await browser.get('index.html#/form');
    const helperPromise = ppromise.when(true).then(function() {
      return element(by.binding('greeting'));
    });

    await helperPromise.then(async function(finalResult: ElementFinder) {
      await expect(finalResult.getText()).toEqual('Hiya');
    } as any as (() => ppromise.Promise<void>));
  });

  it('should be usable in WebDriver functions', async function() {
    await browser.get('index.html#/form');
    const greeting = element(by.binding('greeting'));
    await browser.executeScript('arguments[0].scrollIntoView', greeting);
  });

  it('should allow null as success handler', async function() {
    await browser.get('index.html#/form');

    const name = element(by.binding('username'));

    await expect(name.getText()).toEqual('Anon');
    await expect(name.getText().then(null, function() {})).toEqual('Anon');

  });

  it('should check equality correctly', async function() {
    await browser.get('index.html#/form');

    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    await expect(usernameInput.equals(usernameInput)).toEqual(true);
    await expect(usernameInput.equals(name)).toEqual(false);
  });
});
