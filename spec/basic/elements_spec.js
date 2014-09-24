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

  it('should chain element actions', function() {
    browser.get('index.html#/form');

    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    expect(name.getText()).toEqual('Anon');

    usernameInput.clear().sendKeys('Jane');
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

  it('should determine element presence properly with chaining', function() {
    browser.get('index.html#/conflict');
    expect(element(by.id('baz')).
        isElementPresent(by.binding('item.reusedBinding'))).
        toBe(true);

    expect(element(by.id('baz')).
        isElementPresent(by.binding('nopenopenope'))).
        toBe(false);
  });

  it('should export an isPresent helper', function() {
    browser.get('index.html#/form');

    expect(element(by.binding('greet')).isPresent()).toBe(true);
    expect(element(by.binding('nopenopenope')).isPresent()).toBe(false);
  });

  it('should allow handling errors', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').getText().then(function(success) {
      // This should throw an error. Fail.
      expect(true).toEqual(false);
    }, function(err) {
      expect(true).toEqual(true);
    });
  });

  it('should allow handling chained errors', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').$('furthernope').getText().then(
      function(success) {
        // This should throw an error. Fail.
        expect(true).toEqual(false);
      }, function(err) {
        expect(true).toEqual(true);
      });
  });

  it('isPresent() should not raise error on chained finders', function() {
    browser.get('index.html#/form');
    var elmFinder = $('.nopenopenope').element(by.binding('greet'));

    expect(elmFinder.isPresent()).toBe(false);
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

  it('should propagate exceptions', function() {
    browser.get('index.html#/form');
    var successful = protractor.promise.defer();

    var invalidElement = element(by.binding('INVALID'));
    invalidElement.getText().then(function(value) {
      successful.fulfill(true);
    }, function(err) {
      successful.fulfill(false);
    });
    expect(successful).toEqual(false);
  });

  it('then function should be equivalent to itself', function() {
    browser.get('index.html#/form');
    var elem = element(by.binding('greeting'));

    elem.then(function(elem2) {
      expect(elem.getId()).toEqual(elem2.getId());
    });
  });

  it('should not resolve to itself', function() {
    browser.get('index.html#/form');
    var elem1 = element(by.binding('greeting'));

    elem1.then(function(result) {
      expect(result === elem1).toBe(false);
    });
  });

  it('should be returned from a helper without infinite loops', function() {
    browser.get('index.html#/form');
    var helperPromise = element(by.binding('greeting')).then(function(result) {
      return result;
    });

    helperPromise.then(function(finalResult) {
      expect(finalResult.getText()).toEqual('Hiya');
    });
  });

  it('should allow null as success handler', function() {
    browser.get('index.html#/form');

    var usernameInput = element(by.model('username'));
    var name = element(by.binding('username'));

    expect(name.getText()).toEqual('Anon');
    expect(
      name.getText().then(null, function(){})
    ).toEqual('Anon');

  });
});

describe('ElementArrayFinder', function() {

  it('action should act on all elements', function() {
    browser.get('index.html#/conflict');

    var multiElement = element.all(by.binding('item.reusedBinding'));
    expect(multiElement.getText()).toEqual(['Outer: outer', 'Inner: inner']);
  });

  it('click action should act on all elements', function() {
    var checkboxesElms = $$('#checkboxes input');
    browser.get('index.html');

    expect(checkboxesElms.isSelected()).toEqual([true, false, false]);
    checkboxesElms.click();
    expect(checkboxesElms.isSelected()).toEqual([false, true, true]);
  });

  it('action should act on all elements selected by filter', function() {
    browser.get('index.html');

    var multiElement = $$('#checkboxes input').filter(function(elem, index) {
      return index == 1 || index == 2;
    });
    multiElement.click();
    expect($('#letterlist').getText()).toEqual('wx');
  });

  it('filter should chain with index correctly', function() {
    browser.get('index.html');

    var elem = $$('#checkboxes input').filter(function(elem, index) {
      return index == 1 || index == 2;
    }).last();
    elem.click();
    expect($('#letterlist').getText()).toEqual('x');
  });

  it('filter should work in page object', function() {
    var elements = element.all(by.css('.menu li a')).filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'bindings';
      });
    });

    browser.get('index.html#/form');
    expect(elements.count()).toEqual(1);
  });

  it('should be able to get ElementFinder from filtered ElementArrayFinder', function() {
    var containsI = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf("i") > -1;
      });
    };
    var elements = element.all(by.css('.menu li a')).filter(containsI);

    browser.get('index.html#/form');
    expect(elements.count()).toEqual(4);
    expect(elements.get(3).getText()).toEqual('animation');
  });

  it('filter should be compoundable', function() {
    var containsA = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf("a") > -1;
      });
    };
    var containsI = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf("i") > -1;
      });
    };
    var elements = element.all(by.css('.menu li a')).filter(containsA).filter(containsI);

    browser.get('index.html#/form');
    expect(elements.count()).toEqual(1);
    elements.then(function(arr) {
      expect(arr[0].getText()).toEqual('animation');
    });
  });

  it('filter should work with reduce', function() {
    var containsA = function(elem) {
      return elem.getText().then(function(text) {
        return text.indexOf("a") > -1;
      });
    };
    browser.get('index.html#/form');
    var value = element.all(by.css('.menu li a')).filter(containsA).
        reduce(function(currentValue, elem, index, elemArr) {
          return elem.getText().then(function(text) {
            return currentValue + index + '/' + elemArr.length + ': ' + text + '\n';
          });
        }, '');

    expect(value).toEqual('0/3: repeater\n' +
                          '1/3: async\n' +
                          '2/3: animation\n');
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

  it('should wait to grab multiple chained elements', function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.id('baz')).all(by.binding('item'));

    browser.get('index.html#/conflict');

    expect(reused.count()).toEqual(2);
    expect(reused.get(0).getText()).toEqual('Inner: inner');
    expect(reused.last().getText()).toEqual('Inner other: innerbarbaz');
  });

  it('should wait to grab elements chained by index', function() {
    // These should throw no error before a page is loaded.
    var reused = element(by.id('baz')).all(by.binding('item'));
    var first = reused.first();
    var second = reused.get(1);
    var last = reused.last();

    browser.get('index.html#/conflict');

    expect(reused.count()).toEqual(2);
    expect(first.getText()).toEqual('Inner: inner');
    expect(second.getText()).toEqual('Inner other: innerbarbaz');
    expect(last.getText()).toEqual('Inner other: innerbarbaz');
  });

  it('should count all elements', function() {
    browser.get('index.html#/form');

    element.all(by.model('color')).count().then(function(num) {
      expect(num).toEqual(3);
    });

    // Should also work with promise expect unwrapping
    expect(element.all(by.model('color')).count()).toEqual(3);
  });

  it('should return 0 when counting no elements', function() {
    browser.get('index.html#/form');

    expect(element.all(by.binding('doesnotexist')).count()).toEqual(0);
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

  it('should keep a reference to the array original locator', function() {
    var byCss = by.css('.menu li a');
    var byModel = by.model('color');
    browser.get('index.html#/form');

    expect(element.all(byCss).locator()).toEqual(byCss);
    expect(element.all(byModel).locator()).toEqual(byModel);
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

  it('should filter elements', function() {
    browser.get('index.html#/form');
    var count = element.all(by.css('.menu li a')).filter(function(elem) {
      return elem.getText().then(function(text) {
        return text === 'bindings';
      });
    }).then(function(filteredElements) {
      return filteredElements.length;
    });

    expect(count).toEqual(1);
  });

  it('should reduce elements', function() {
    browser.get('index.html#/form');
    var value = element.all(by.css('.menu li a')).
        reduce(function(currentValue, elem, index, elemArr) {
          return elem.getText().then(function(text) {
            return currentValue + index + '/' + elemArr.length + ': ' + text + '\n';
          });
        }, '');

    expect(value).toEqual('0/7: repeater\n' +
                          '1/7: bindings\n' +
                          '2/7: form\n' +
                          '3/7: async\n' +
                          '4/7: conflict\n' +
                          '5/7: polling\n' +
                          '6/7: animation\n');
  });

  it('should always return a promise when calling then', function() {
    browser.get('index.html#/form');
    var e1 = element(by.tagName('body')).then(function(){});
    expect(e1 instanceof protractor.promise.Promise).toBe(true);
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

  it('should grab by css', function() {
    expect($('.planet-info').getText()).
        toEqual(element(by.css('.planet-info')).getText());
    expect($$('option').count()).toEqual(element.all(by.css('option')).count());
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
