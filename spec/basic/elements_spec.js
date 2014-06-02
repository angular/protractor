var util = require('util');

describe('ElementFinder', function() {
  beforeEach(function() {
    // Clear everything between each test.
    browser.driver.get('about:blank');
  });

  it('should return the same result as browser.findElement', function() {
    browser.get('index.html#/form');
    var nameByElement = element(by.binding('username'));
    expect(nameByElement.getText()).toEqual(
        browser.findElement(by.binding('username')).getText());
  });

  it('should wait to grab the WebElement until a method is called', function() {
    // These should throw no error before a page is loaded.
    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    browser.get('index.html#/form');

    expect(name.getText()).toEqual('Anon');

    usernameInput.clear();
    usernameInput.sendKeys('Jane');
    expect(name.getText()).toEqual('Jane');
  });

  it('chained call should wait to grab the WebElement until a method is called',
      function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.id('baz')).
        element(by.binding('item.reusedBinding'));

    browser.get('index.html#/conflict');

    expect(reused.getText()).toEqual('Inner: inner');
    expect(reused.isPresent()).toBe(true);
  });

  it('should differentiate elements with the same binding by chaining',
      function() {
        browser.get('index.html#/conflict');

        var outerReused = element(by.binding('item.reusedBinding'));
        var innerReused =
            element(by.id('baz')).element(by.binding('item.reusedBinding'));

        expect(outerReused.getText()).toEqual('Outer: outer');
        expect(innerReused.getText()).toEqual('Inner: inner');
      });

  it('should chain deeper than 2', function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.css('body')).element(by.id('baz')).
        element(by.binding('item.reusedBinding'));

    browser.get('index.html#/conflict');

    expect(reused.getText()).toEqual('Inner: inner');
  });

  it('should find multiple elements scoped properly with chaining', function() {
    browser.get('index.html#/conflict');

    element.all(by.binding('item')).then(function(elems) {
      expect(elems.length).toEqual(4);
    });

    element(by.id('baz')).all(by.binding('item')).then(function(elems) {
      expect(elems.length).toEqual(2);
    });
  });

  it('should wait to grab multiple chained elements',
      function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.id('baz')).all(by.binding('item'));

    browser.get('index.html#/conflict');

    expect(reused.count()).toEqual(2);
    expect(reused.get(0).getText()).toEqual('Inner: inner');
    expect(reused.last().getText()).toEqual('Inner other: innerbarbaz');
  });

  it('should determine element presence properly with chaining', function() {
    browser.get('index.html#/conflict');
    expect(element(by.id('baz')).
        isElementPresent(by.binding('item.reusedBinding'))).
        toBe(true);

    expect(element(by.id('baz')).
        isElementPresent(by.binding('nopenopenope'))).
        toBe(false);
  });

  it('should count all elements', function() {
    browser.get('index.html#/form');

    element.all(by.model('color')).count().then(function(num) {
      expect(num).toEqual(3);
    });

    // Should also work with promise expect unwrapping
    expect(element.all(by.model('color')).count()).toEqual(3);
  });

  it('should get an element from an array', function() {
    var colorList = element.all(by.model('color'));

    browser.get('index.html#/form');

    expect(colorList.get(0).getAttribute('value')).toEqual('blue');
    expect(colorList.get(1).getAttribute('value')).toEqual('green');
    expect(colorList.get(2).getAttribute('value')).toEqual('red');
  });

  it('should get the first element from an array', function() {
    var colorList = element.all(by.model('color'));
    browser.get('index.html#/form');

    expect(colorList.first(0).getAttribute('value')).toEqual('blue');
  });

  it('should get the last element from an array', function() {
    var colorList = element.all(by.model('color'));
    browser.get('index.html#/form');

    expect(colorList.last(0).getAttribute('value')).toEqual('red');
  });

  it('should perform an action on each element in an array', function() {
    var colorList = element.all(by.model('color'));
    browser.get('index.html#/form');

    colorList.each(function(colorElement) {
      expect(colorElement.getText()).not.toEqual('purple');
    });
  });

  it('should map each element on array and with promises', function() {
    browser.get('index.html#/form');
    var labels = element.all(by.css('.menu li a')).map(function(elm, index) {
      return {
        index: index,
        text: elm.getText()
      };
    });

    expect(labels).toEqual([
      {index: 0, text: 'repeater'},
      {index: 1, text: 'bindings'},
      {index: 2, text: 'form'},
      {index: 3, text: 'async'},
      {index: 4, text: 'conflict'},
      {index: 5, text: 'polling'},
      {index: 6, text: 'animation'}
    ]);
  });

  it('should map and resolve multiple promises', function() {
    browser.get('index.html#/form');
    var labels = element.all(by.css('.menu li a')).map(function(elm) {
      return {
        text: elm.getText(),
        inner: elm.getInnerHtml(),
        outer: elm.getOuterHtml()
      };
    });

    var newExpected = function(expectedLabel) {
      return {
        text: expectedLabel,
        inner: expectedLabel,
        outer: '<a href="#/' + expectedLabel + '">' + expectedLabel + '</a>'
      };
    };

    expect(labels).toEqual([
      newExpected('repeater'),
      newExpected('bindings'),
      newExpected('form'),
      newExpected('async'),
      newExpected('conflict'),
      newExpected('polling'),
      newExpected('animation')
    ]);
  });

  it('should map each element from a literal and promise array', function() {
    browser.get('index.html#/form');
    var i = 1;
    var labels = element.all(by.css('.menu li a')).map(function(elm) {
      return i++;
    });

    expect(labels).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('should export an isPresent helper', function() {
    browser.get('index.html#/form');

    expect(element(by.binding('greet')).isPresent()).toBe(true);
    expect(element(by.binding('nopenopenope')).isPresent()).toBe(false);
  });

  it('should export an allowAnimations helper', function() {
    browser.get('index.html#/animation');
    var animationTop = element(by.id('animationTop'));
    var toggledNode = element(by.id('toggledNode'));

    expect(animationTop.allowAnimations()).toBe(true);
    animationTop.allowAnimations(false);
    expect(animationTop.allowAnimations()).toBe(false);

    expect(toggledNode.isPresent()).toBe(true);
    element(by.id('checkbox')).click();
    expect(toggledNode.isPresent()).toBe(false);
  });

  it('should keep a reference to the original locator', function() {
    browser.get('index.html#/form');

    var byCss = by.css('body');
    var byBinding = by.binding('greet');

    expect(element(byCss).locator()).toEqual(byCss);
    expect(element(byBinding).locator()).toEqual(byBinding);
  });
});

describe('evaluating statements', function() {
  beforeEach(function() {
    browser.get('index.html#/form');
  });

  it('should evaluate statements in the context of an element', function() {
    var checkboxElem = element(by.id('checkboxes'));

    checkboxElem.evaluate('show').then(function(output) {
      expect(output).toBe(true);
    });

    // Make sure it works with a promise expectation.
    expect(checkboxElem.evaluate('show')).toBe(true);
  });
});

describe('shortcut css notation', function() {
  beforeEach(function() {
    browser.get('index.html#/bindings');
  });
  
  it('should chain $$ with $', function() {
    var withoutShortcutCount =
        element(by.css('select')).all(by.css('option')).then(function(options) {
          return options.length;
        });
    var withShortcutCount = $('select').$$('option').count();

    expect(withoutShortcutCount).toEqual(withShortcutCount);
  });
});
