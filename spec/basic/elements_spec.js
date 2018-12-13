const {WebElement} = require('selenium-webdriver');

describe('ElementFinder', () => {
  beforeEach(async() => {
    // Clear everything between each test.
    await browser.driver.get('about:blank');
  });

  it('should return the same result as browser.findElement', async() => {
    await browser.get('index.html#/form');
    const nameByElement = element(by.binding('username'));

    expect(await nameByElement.getText()).toEqual(
        await browser.findElement(by.binding('username')).getText());
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

    await usernameInput.clear().sendKeys('Jane');
    expect(await name.getText()).toEqual('Jane');
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
    const innerReused = element(by.id('baz'))
        .element(by.binding('item.reusedBinding'));

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

  it('should determine element presence properly with chaining', async() => {
    await browser.get('index.html#/conflict');
    expect(await element(by.id('baz'))
        .isElementPresent(by.binding('item.reusedBinding')))
        .toBe(true);

    expect(await element(by.id('baz'))
        .isElementPresent(by.binding('nopenopenope')))
        .toBe(false);
  });

  it('should export an isPresent helper', async() => {
    await browser.get('index.html#/form');

    expect(await element(by.binding('greet')).isPresent()).toBe(true);
    expect(await element(by.binding('nopenopenope')).isPresent()).toBe(false);
  });

  it('should allow handling errors', async() => {
    await browser.get('index.html#/form');
    try {
      await $('.nopenopenope').getText();
      expect(true).toEqual(false);
    } catch (err) {
      expect(true).toEqual(true);
    }
  });

  it('should allow handling chained errors', async() => {
    await browser.get('index.html#/form');
    try {
      await await $('.nopenopenope').$('furthernope').getText();
      expect(true).toEqual(false);
    } catch (err) {
      expect(true).toEqual(true);
    }
  });

  it('isPresent() should be friendly with out of bounds error', async() => {
    await browser.get('index.html#/form');
    const elementsNotPresent = element.all(by.id('notPresentElementID'));
    expect(await elementsNotPresent.first().isPresent()).toBe(false);
    expect(await elementsNotPresent.last().isPresent()).toBe(false);
  });

  it('isPresent() should not raise error on chained finders', async() => {
    await browser.get('index.html#/form');
    const elmFinder = $('.nopenopenope').element(by.binding('greet'));

    expect(await elmFinder.isPresent()).toBe(false);
  });

  it('should export an allowAnimations helper', async() => {
    await browser.get('index.html#/animation');
    const animationTop = element(by.id('animationTop'));
    const toggledNode = element(by.id('toggledNode'));

    expect(await animationTop.allowAnimations()).toBe(true);
    await animationTop.allowAnimations(false);
    expect(await animationTop.allowAnimations()).toBe(false);

    expect(await toggledNode.isPresent()).toBe(true);
    await element(by.id('checkbox')).click();
    expect(await toggledNode.isPresent()).toBe(false);
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
    const successful = await invalidElement.getText().then(() => {
      return true;
    }, function() {
      return false;
    });
    expect(successful).toEqual(false);
  });

  it('should be returned from a helper without infinite loops', async() => {
    await browser.get('index.html#/form');
    const helperPromise = Promise.resolve(true).then(() => {
      return element(by.binding('greeting'));
    });

    await helperPromise.then(async(finalResult) => {
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
    expect(
      await name.getText().then(null, function() {})
    ).toEqual('Anon');

  });

  it('should check equality correctly', async() => {
    await browser.get('index.html#/form');

    const usernameInput = element(by.model('username'));
    const name = element(by.binding('username'));

    expect(await usernameInput.equals(usernameInput)).toEqual(true);
    expect(await usernameInput.equals(name)).toEqual(false);
  });
});

describe('ElementArrayFinder', () => {

  it('action should act on all elements', async() => {
    await browser.get('index.html#/conflict');

    const multiElement = element.all(by.binding('item.reusedBinding'));
    expect(await multiElement.getText())
        .toEqual(['Outer: outer', 'Inner: inner']);
  });

  it('click action should act on all elements', async() => {
    const checkboxesElms = $$('#checkboxes input');
    await browser.get('index.html');

    expect(await checkboxesElms.isSelected())
        .toEqual([true, false, false, false]);
    await checkboxesElms.click();
    expect(await checkboxesElms.isSelected())
        .toEqual([false, true, true, true]);
  });

  it('action should act on all elements selected by filter', async() => {
    await browser.get('index.html');

    const multiElement = $$('#checkboxes input').filter((_, index) => {
      return index == 2 || index == 3;
    });
    await multiElement.click();
    expect(await $('#letterlist').getText()).toEqual('wx');
  });

  it('filter should chain with index correctly', async() => {
    await browser.get('index.html');

    const elem = $$('#checkboxes input').filter((_, index) => {
      return index == 2 || index == 3;
    }).last();
    await elem.click();
    expect(await $('#letterlist').getText()).toEqual('x');
  });

  it('filter should work in page object', async() => {
    const elements = element.all(by.css('#animals ul li'))
        .filter(async(elem) => {
      let text = await elem.getText();
      return text === 'big dog';
    });

    await browser.get('index.html#/form');
    expect(await elements.count()).toEqual(1);
  });

  it('should be able to get ElementFinder from filtered ElementArrayFinder',
      async() => {
    const isDog = async(elem) => {
      const text = await elem.getText();
      return text.indexOf('dog') > -1;
    };
    const elements = element.all(by.css('#animals ul li')).filter(isDog);

    await browser.get('index.html#/form');
    expect(await elements.count()).toEqual(3);
    expect(await elements.get(2).getText()).toEqual('other dog');
  });

  it('filter should be compoundable', async() => {
    const isDog = async(elem) => {
      const text = await elem.getText();
      return text.indexOf('dog') > -1;
    };
    const isBig = async(elem) => {
      const text = await elem.getText();
      return text.indexOf('big') > -1;
    };
    const elements = element.all(by.css('#animals ul li'))
        .filter(isDog).filter(isBig);

    await browser.get('index.html#/form');
    expect(await elements.count()).toEqual(1);
    const arr = await elements;
    expect(await arr[0].getText()).toEqual('big dog');
  });

  it('filter should work with reduce', async() => {
    const isDog = async(elem) => {
      const text = await elem.getText();
      return text.indexOf('dog') > -1;
    };
    await browser.get('index.html#/form');
    const value = element.all(by.css('#animals ul li')).filter(await isDog).
        reduce(async(currentValue, elem, index, elemArr) => {
          const text = await elem.getText();
          return currentValue + index + '/' + elemArr.length + ': ' +
              text + '\n';
        }, '');

    expect(await value).toEqual(
        '0/3: big dog\n' +
        '1/3: small dog\n' +
        '2/3: other dog\n');
  });

  it('should find multiple elements scoped properly with chaining', async() => {
    await browser.get('index.html#/conflict');

    let elems = await element.all(by.binding('item'));
    expect(elems.length).toEqual(4);

    elems = await element(by.id('baz')).all(by.binding('item'));
    expect(elems.length).toEqual(2);
  });

  it('should wait to grab multiple chained elements', async() => {
    // These should throw no error before a page is loaded.
    const reused = element(by.id('baz')).all(by.binding('item'));

    await browser.get('index.html#/conflict');

    expect(await reused.count()).toEqual(2);
    expect(await reused.get(0).getText()).toEqual('Inner: inner');
    expect(await reused.last().getText()).toEqual('Inner other: innerbarbaz');
  });

  it('should wait to grab elements chained by index', async() => {
    // These should throw no error before a page is loaded.
    const reused = element(by.id('baz')).all(by.binding('item'));
    const first = reused.first();
    const second = reused.get(1);
    const last = reused.last();

    await browser.get('index.html#/conflict');

    expect(await reused.count()).toEqual(2);
    expect(await first.getText()).toEqual('Inner: inner');
    expect(await second.getText()).toEqual('Inner other: innerbarbaz');
    expect(await last.getText()).toEqual('Inner other: innerbarbaz');
  });

  it('should count all elements', async() => {
    await browser.get('index.html#/form');

    await element.all(by.model('color')).count().then((num) => {
      expect(num).toEqual(3);
    });

    // Should also work with promise expect unwrapping
    expect(await element.all(by.model('color')).count()).toEqual(3);
  });

  it('should return 0 when counting no elements', async() => {
    await browser.get('index.html#/form');

    expect(await element.all(by.binding('doesnotexist')).count()).toEqual(0);
  });

  it('supports isPresent()', async() => {
    await browser.get('index.html#/form');

    expect(await element.all(by.model('color')).isPresent()).toBeTruthy();
    expect(await element.all(by.binding('doesnotexist')).isPresent())
        .toBeFalsy();
  });

  it('should return not present when an element disappears within an array',
      async() => {
    await browser.get('index.html#/form');
    const elements = await element.all(by.model('color'))
    const disappearingElem = elements[0];
    expect(await disappearingElem.isPresent()).toBeTruthy();
    await browser.get('index.html#/bindings');
    expect(await disappearingElem.isPresent()).toBeFalsy();
  });

  it('should get an element from an array', async () => {
    const colorList = element.all(by.model('color'));

    await browser.get('index.html#/form');

    expect(await colorList.get(0).getAttribute('value')).toEqual('blue');
    expect(await colorList.get(1).getAttribute('value')).toEqual('green');
    expect(await colorList.get(2).getAttribute('value')).toEqual('red');
  });

  it('should get an element from an array by promise index', async() => {
    const colorList = element.all(by.model('color'));
    const index = Promise.resolve(1);

    await browser.get('index.html#/form');

    expect(await colorList.get(await index).getAttribute('value')).toEqual('green');
  });

  it('should get an element from an array using negative indices', async() => {
    const colorList = element.all(by.model('color'));

    await browser.get('index.html#/form');

    expect(await colorList.get(-3).getAttribute('value')).toEqual('blue');
    expect(await colorList.get(-2).getAttribute('value')).toEqual('green');
    expect(await colorList.get(-1).getAttribute('value')).toEqual('red');
  });

  it('should get the first element from an array', async() => {
    const colorList = element.all(by.model('color'));
    await browser.get('index.html#/form');

    expect(await colorList.first().getAttribute('value')).toEqual('blue');
  });

  it('should get the last element from an array', async() => {
    const colorList = element.all(by.model('color'));
    await browser.get('index.html#/form');

    expect(await colorList.last().getAttribute('value')).toEqual('red');
  });

  it('should perform an action on each element in an array', async() => {
    const colorList = element.all(by.model('color'));
    await browser.get('index.html#/form');

    await colorList.each(async(colorElement) => {
      expect(await colorElement.getText()).not.toEqual('purple');
    });
  });

  it('should allow accessing subelements from within each', async() => {
    await browser.get('index.html#/form');
    const rows = element.all(by.css('.rowlike'));

    await rows.each(async(row) => {
      const input = row.element(by.css('.input'));
      expect(await input.getAttribute('value')).toEqual('10');
    });

    await rows.each(async(row) => {
      const input = row.element(by.css('input'));
      expect(await input.getAttribute('value')).toEqual('10');
    });
  });

  it('should keep a reference to the array original locator', async() => {
    const byCss = by.css('#animals ul li');
    const byModel = by.model('color');
    await browser.get('index.html#/form');

    expect(await element.all(byCss).locator()).toEqual(byCss);
    expect(await element.all(byModel).locator()).toEqual(byModel);
  });

  it('should map each element on array and with promises', async() => {
    await browser.get('index.html#/form');
    const labels = element.all(by.css('#animals ul li'))
        .map(async(elm, index) => {
      return {
        index: index,
        text: await elm.getText()
      };
    });

    expect(await labels).toEqual([
      {index: 0, text: 'big dog'},
      {index: 1, text: 'small dog'},
      {index: 2, text: 'other dog'},
      {index: 3, text: 'big cat'},
      {index: 4, text: 'small cat'}
    ]);
  });

  it('should map and resolve multiple promises', async() => {
    await browser.get('index.html#/form');
    const labels = element.all(by.css('#animals ul li'))
        .map(async (elm) => {
      return {
        text: await elm.getText(),
        tagName: await elm.getTagName()
      };
    });

    const newExpected = (expectedLabel) => {
      return {
        text: expectedLabel,
        tagName: 'li'
      };
    };

    expect(await labels).toEqual([
      newExpected('big dog'),
      newExpected('small dog'),
      newExpected('other dog'),
      newExpected('big cat'),
      newExpected('small cat')
    ]);
  });

  it('should map each element from a literal and promise array', async() => {
    await browser.get('index.html#/form');
    let i = 1;
    const labels = await element.all(by.css('#animals ul li'))
        .map(() => {
      return i++;
    });
    expect(labels).toEqual([1, 2, 3, 4, 5]);
  });

  it('should filter elements', async() => {
    await browser.get('index.html#/form');
    
    const filteredElements = await element.all(by.css('#animals ul li'))
        .filter(async(elem) => {
      const text = await elem.getText();
      return text === 'big dog';
    });
    const count = filteredElements.length;
    expect(await count).toEqual(1);
  });

  it('should reduce elements', async () => {
    await browser.get('index.html#/form');
    const value = element.all(by.css('#animals ul li')).
        reduce(async(currentValue, elem, index, elemArr) => {
          const text = await elem.getText();
          return currentValue + index + '/' + elemArr.length + ': ' +
              text + '\n';
        }, '');

    expect(await value).toEqual(
        '0/5: big dog\n' +
        '1/5: small dog\n' +
        '2/5: other dog\n' +
        '3/5: big cat\n' +
        '4/5: small cat\n');
  });

  it('should allow using protractor locator within map', async() => {
    await browser.get('index.html#/repeater');

    const expected = [
        { first: 'M', second: 'Monday' },
        { first: 'T', second: 'Tuesday' },
        { first: 'W', second: 'Wednesday' },
        { first: 'Th', second: 'Thursday' },
        { first: 'F', second: 'Friday' }];

    const result = element.all(by.repeater('allinfo in days'))
        .map(async(el) => {
      return {
        first: await el.element(by.binding('allinfo.initial')).getText(),
        second: await el.element(by.binding('allinfo.name')).getText()
      };
    });

    expect(await result).toEqual(expected);
  });
});

describe('evaluating statements', () => {
  beforeEach(async() => {
    await browser.get('index.html#/form');
  });

  it('should evaluate statements in the context of an element', async() => {
    const checkboxElem = element(by.id('checkboxes'));

    const output = await checkboxElem.evaluate('show');
    expect(output).toBe(true);

    // Make sure it works with a promise expectation.
    expect(await checkboxElem.evaluate('show')).toBe(true);
  });
});

describe('shortcut css notation', () => {
  beforeEach(async() => {
    await browser.get('index.html#/bindings');
  });

  it('should grab by css', async() => {
    expect(await $('.planet-info').getText())
        .toEqual(await element(by.css('.planet-info')).getText());
    expect(await $$('option').count())
        .toEqual(await element.all(by.css('option')).count());
  });

  it('should chain $$ with $', async() => {
    const options = await element(by.css('select')).all(by.css('option'));
    const withoutShortcutCount = options.length;
    const withShortcutCount = await $('select').$$('option').count();

    expect(withoutShortcutCount).toEqual(withShortcutCount);
  });
});
