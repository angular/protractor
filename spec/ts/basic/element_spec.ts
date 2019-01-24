// Based off of spec/basic/elements_spec.js
import {$, browser, by, element, ElementArrayFinder, ElementFinder} from '../../..';

describe('ElementFinder', () => {
  it('should return the same result as browser.findElement', async() => {
    await browser.get('index.html#/form');
    const nameByElement = element(by.binding('username'));

    expect(await nameByElement.getText())
        .toEqual(await browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', async() => {
    // These should throw no error before a page is loaded.
    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    await browser.get('index.html#/form');

    expect(await name.getText()).toEqual('Anon');

    await usernameInput.clear();
    await usernameInput.sendKeys('Jane');
    expect(await name.getText()).toEqual('Jane');
  });

  it('should chain element actions', async() => {
    await browser.get('index.html#/form');

    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    expect(await name.getText()).toEqual('Anon');

    await((usernameInput.clear() as any) as ElementFinder).sendKeys('Jane');
    expect(await name.getText()).toEqual('Jane');
  });

  it('should run chained element actions in sequence', async () => {
    // Testing private methods is bad :(
    let els = new ElementArrayFinder(browser, () => {
      return Promise.resolve([null]);
    });
    let applyAction_: (actionFn: (value: any, index: number, array: any) => any) =>
        ElementArrayFinder = (ElementArrayFinder as any).prototype.applyAction_;
    let order: string[] = [];

    let deferredA: Promise<void>;
    els = applyAction_.call(els, () => {
      deferredA = new Promise<void>(resolve => {
        order.push('a');
        resolve();
      });
    });
    let deferredB: Promise<void>;
    els = applyAction_.call(els, () => {
      deferredB = new Promise<void>(resolve => {
        order.push('b');
        resolve();
      });
    });

    await deferredB;
    setTimeout(async () => {
      await deferredA;
      await els;
      expect(order).toEqual(['a', 'b']);
    }, 100);
  });

  it('chained call should wait to grab the WebElement until a method is called',
      async() => {
    // These should throw no error before a page is loaded.
    const reused = element(by.id('baz'))
        .element(by.binding('item.reusedBinding'));

    await browser.get('index.html#/conflict');

    expect(await reused.getText()).toEqual('Inner: inner');
    expect(await reused.isPresent()).toBe(true);
  });

  it('should differentiate elements with the same binding by chaining',
      async() => {
    await browser.get('index.html#/conflict');

    const outerReused = element(by.binding('item.reusedBinding'));
    const innerReused = element(by.id('baz')).element(by.binding('item.reusedBinding'));

    expect(await outerReused.getText()).toEqual('Outer: outer');
    expect(await innerReused.getText()).toEqual('Inner: inner');
  });

  it('should chain deeper than 2', async() => {
    // These should throw no error before a page is loaded.
    const reused = element(by.css('body')).element(by.id('baz'))
        .element(by.binding('item.reusedBinding'));

    await browser.get('index.html#/conflict');

    expect(await reused.getText()).toEqual('Inner: inner');
  });

  it('should allow handling errors', async() => {
    await browser.get('index.html#/form');
    try {
      await $('.nopenopenope').getText();

      // The above line should have throw an error. Fail.
      expect(true).toEqual(false);
    } catch (e) {
      expect(true).toEqual(true);
    }
  });

  it('should allow handling chained errors', async() => {
    await browser.get('index.html#/form');
    try {
      await $('.nopenopenope').$('furthernope').getText();

      // The above line should have throw an error. Fail.
      expect(true).toEqual(false);
    } catch (e) {
      expect(true).toEqual(true);
    }
  });

  it('should keep a reference to the original locator', async() => {
    await browser.get('index.html#/form');

    const byCss = by.css('body');
    const byBinding = by.binding('greet');

    expect(await element(byCss).locator()).toEqual(byCss);
    expect(await element(byBinding).locator()).toEqual(byBinding);
  });

  it('should propagate exceptions', async() => {
    await browser.get('index.html#/form');

    const invalidElement = element(by.binding('INVALID'));
    const successful = invalidElement.getText().then(
        function() {
          return true;
        } as any as (() => Promise<boolean>),
        function() {
          return false;
        } as any as (() => Promise<boolean>));
    expect(await successful).toEqual(false);
  });

  it('should be returned from a helper without infinite loops', async() => {
    await browser.get('index.html#/form');
    const helperPromise = Promise.resolve(true).then(() => {
      return element(by.binding('greeting'));
    });

    await helperPromise.then(async(finalResult: ElementFinder) => {
      expect(await finalResult.getText()).toEqual('Hiya');
    });
  });

  it('should be usable in WebDriver functions', async() => {
    await browser.get('index.html#/form');
    const greeting = element(by.binding('greeting'));
    await browser.executeScript('arguments[0].scrollIntoView', greeting);
  });

  it('should allow null as success handler', async() => {
    await browser.get('index.html#/form');

    const name = element(by.binding('username'));

    expect(await name.getText()).toEqual('Anon');
    expect(await name.getText().then(null, function() {})).toEqual('Anon');

  });

  it('should check equality correctly', async() => {
    await browser.get('index.html#/form');

    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    expect(await usernameInput.equals(usernameInput)).toEqual(true);
    expect(await usernameInput.equals(name)).toEqual(false);
  });
});
