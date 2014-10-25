var url = require('url');
var util = require('util');
var webdriver = require('selenium-webdriver');

var clientSideScripts = require('./clientsidescripts.js');
var ProtractorBy = require('./locators.js').ProtractorBy;

/* global angular */

var DEFER_LABEL = 'NG_DEFER_BOOTSTRAP!';

var WEB_ELEMENT_FUNCTIONS = [
  'click', 'sendKeys', 'getTagName', 'getCssValue', 'getAttribute', 'getText',
  'getSize', 'getLocation', 'isEnabled', 'isSelected', 'submit', 'clear',
  'isDisplayed', 'getOuterHtml', 'getInnerHtml', 'getId'];

var STACK_SUBSTRINGS_TO_FILTER = [
  'node_modules/minijasminenode/lib/',
  'node_modules/selenium-webdriver',
  'at Module.',
  'at Object.Module.',
  'at Function.Module',
  '(timers.js:',
  'jasminewd/index.js',
  'protractor/lib/'
];

var DEFAULT_RESET_URL = 'data:text/html,<html></html>';
var DEFAULT_GET_PAGE_TIMEOUT = 10000;

/*
 * Mix in other webdriver functionality to be accessible via protractor.
 */
for (var foo in webdriver) {
  exports[foo] = webdriver[foo];
}

/**
 * @type {ProtractorBy}
 */
exports.By = new ProtractorBy();

/**
 * Mix a function from one object onto another. The function will still be
 * called in the context of the original object.
 *
 * @private
 * @param {Object} to
 * @param {Object} from
 * @param {string} fnName
 * @param {function=} setupFn
 */
var mixin = function(to, from, fnName, setupFn) {
  to[fnName] = function() {
    if (setupFn) {
      setupFn();
    }
    return from[fnName].apply(from, arguments);
  };
};

/**
 * Build the helper 'element' function for a given instance of Protractor.
 *
 * @private
 * @param {Protractor} ptor
 * @return {function(webdriver.Locator): ElementFinder}
 */
var buildElementHelper = function(ptor) {

  /**
   * ElementArrayFinder is used for operations on an array of elements (as opposed
   * to a single element).
   *
   * The ElementArrayFinder is used to set up a chain of conditions that identify
   * an array of elements. In particular, you can call all(locator) and
   * filter(filterFn) to return a new ElementArrayFinder modified by the
   * conditions, and you can call get(index) to return a single ElementFinder at
   * position 'index'.
   *
   * Similar to jquery, ElementArrayFinder will search all branches of the DOM
   * to find the elements that satify the conditions (i.e. all, filter, get).
   * However, an ElementArrayFinder will not actually retrieve the elements until
   * an action is called, which means it can be set up in helper files (i.e.
   * page objects) before the page is available, and reused as the page changes.
   *
   * You can treat an ElementArrayFinder as an array of WebElements for most
   * purposes, in particular, you may perform actions (i.e. click, getText) on
   * them as you would an array of WebElements. The action will apply to
   * every element identified by the ElementArrayFinder. ElementArrayFinder
   * extends Promise, and once an action is performed on an ElementArrayFinder,
   * the latest result can be accessed using then, and will be returned as an
   * array of the results; the array has length equal to the length of the
   * elements found by the ElementArrayFinder and each result represents the
   * result of performing the action on the element. Unlike a WebElement, an
   * ElementArrayFinder will wait for the angular app to settle before
   * performing finds or actions.
   *
   * @alias element.all(locator)
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * element.all(by.css('.items li')).then(function(items) {
   *   expect(items.length).toBe(3);
   *   expect(items[0].getText()).toBe('First');
   * });
   *
   * @constructor
   * @param {function(): Array.<webdriver.WebElement>} getWebElements A function
   *    that returns a list of the underlying Web Elements.
   * @param {webdriver.Locator} locator The most relevant locator. It is only
   *    used for error reporting and ElementArrayFinder.locator.
   * @param {Array.<webdriver.promise.Promise>} opt_actionResults An array
   *    of promises which will be retrieved with then. Resolves to the latest
   *    action result, or null if no action has been called.
   * @return {ElementArrayFinder}
   */
  var ElementArrayFinder = function(getWebElements, locator, opt_actionResults) {
    this.getWebElements = getWebElements || null;
    this.actionResults_ = opt_actionResults;
    this.locator_ = locator;

    var self = this;
    WEB_ELEMENT_FUNCTIONS.forEach(function(fnName) {
      self[fnName] = function() {
        var args = arguments;
        var actionFn = function(webElem) {
          return webElem[fnName].apply(webElem, args);
        };
        return self.applyAction_(actionFn);
      };
    });
  };
  util.inherits(ElementArrayFinder, webdriver.promise.Promise);

  /**
   * Create a shallow copy of ElementArrayFinder.
   *
   * @return {!ElementArrayFinder} A shallow copy of this.
   */
  ElementArrayFinder.prototype.clone = function() {
    // A shallow copy is all we need since the underlying fields can never be
    // modified. (Locator can be modified by the user, but that should
    // rarely/never happen and it doesn't affect functionalities).
    return new ElementArrayFinder(
      this.getWebElements, this.locator_, this.actionResults_); 
  };

  /**
   * Calls to ElementArrayFinder may be chained to find an array of elements
   * using the current elements in this ElementArrayFinder as the starting point.
   * This function returns a new ElementArrayFinder which would contain the
   * children elements found (and could also be empty).
   *
   * @alias element.all(locator).all(locator)
   * @view
   * <div id='id1' class="parent">
   *   <ul>
   *     <li class="foo">1a</li>
   *     <li class="baz">1b</li>
   *   </ul>
   * </div>
   * <div id='id2' class="parent">
   *   <ul>
   *     <li class="foo">2a</li>
   *     <li class="bar">2b</li>
   *   </ul>
   * </div>
   *
   * @example
   * var foo = element.all(by.css('.parent')).all(by.css('.foo'))
   * expect(foo.getText()).toEqual(['1a', '2a'])
   * var baz = element.all(by.css('.parent')).all(by.css('.baz'))
   * expect(baz.getText()).toEqual(['1b'])
   * var nonexistent = element.all(by.css('.parent')).all(by.css('.NONEXISTENT'))
   * expect(nonexistent.getText()).toEqual([''])
   *
   * @param {webdriver.Locator} subLocator
   * @return {ElementArrayFinder}
   */
  ElementArrayFinder.prototype.all = function(locator) {
    var self = this;
    var getWebElements = function() {
      if (self.getWebElements === null) {
        // This is the first time we are looking for an element
        return ptor.waitForAngular().then(function() {
          if (locator.findElementsOverride) {
            return locator.findElementsOverride(ptor.driver, null, ptor.rootEl);
          } else {
            return ptor.driver.findElements(locator);
          }
        });
      } else {
        return self.getWebElements().then(function(parentWebElements) {
          var childrenPromiseList = [];
          // For each parent web element, find their children and construct a 
          // list of Promise<List<child_web_element>>
          parentWebElements.forEach(function(parentWebElement) {
            var childrenPromise = locator.findElementsOverride ?
                locator.findElementsOverride(ptor.driver, parentWebElement, ptor.rootEl) :
                parentWebElement.findElements(locator);
            childrenPromiseList.push(childrenPromise);
          });


          // Resolve the list of Promise<List<child_web_elements>> and merge into
          // a single list
          return webdriver.promise.all(childrenPromiseList).then(
              function(resolved) {
                var childrenList = [];
                resolved.forEach(function(resolvedE) {
                  childrenList = childrenList.concat(resolvedE);
                });
                return childrenList;
              });
        });
      }
    };
    return new ElementArrayFinder(getWebElements, locator);
  };

  /**
   * Apply a filter function to each element within the ElementArrayFinder. Returns
   * a new ElementArrayFinder with all elements that pass the filter function. The
   * filter function receives the ElementFinder as the first argument
   * and the index as a second arg.
   * This does not actually retrieve the underlying list of elements, so it can
   * be used in page objects.
   *
   * @alias element.all(locator).filter(filterFn)
   * @view
   * <ul class="items">
   *   <li class="one">First</li>
   *   <li class="two">Second</li>
   *   <li class="three">Third</li>
   * </ul>
   *
   * @example
   * element.all(by.css('.items li')).filter(function(elem, index) {
   *   return elem.getText().then(function(text) {
   *     return text === 'Third';
   *   });
   * }).then(function(filteredElements) {
   *   filteredElements[0].click();
   * });
   *
   * @param {function(ElementFinder, number): webdriver.WebElement.Promise} filterFn 
   *     Filter function that will test if an element should be returned.
   *     filterFn can either return a boolean or a promise that resolves to a boolean.
   * @return {!ElementArrayFinder} A ElementArrayFinder that represents an array
   *     of element that satisfy the filter function.
   */
  ElementArrayFinder.prototype.filter = function(filterFn) {
    var self = this;
    var getWebElements = function() {
      return self.getWebElements().then(function(parentWebElements) {
        var list = [];
        parentWebElements.forEach(function(parentWebElement, index) {
          var elementFinder = self.get(index); // Wrap in ElementFinder
          var filterResults = filterFn(elementFinder, index);
          if (filterResults instanceof webdriver.promise.Promise) {
            filterResults.then(function(satisfies) {
              if (satisfies) {
                list.push(parentWebElements[index]);
              }
            });
          } else if (filterResults) {
            list.push(parentWebElements[index]);
          }
        });
        return list;
      });
    };
    return new ElementArrayFinder(getWebElements, this.locator_);
  };

  /**
   * Get an element within the ElementArrayFinder by index. The index starts at 0.
   * Negative indices are wrapped (i.e. -i means ith element from last)
   * This does not actually retrieve the underlying element.
   *
   * @alias element.all(locator).get(index)
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * var list = element.all(by.css('.items li'));
   * expect(list.get(0).getText()).toBe('First');
   * expect(list.get(1).getText()).toBe('Second');
   *
   * @param {number} index Element index.
   * @return {ElementFinder} finder representing element at the given index.
   */ 
  ElementArrayFinder.prototype.get = function(index) {
    var self = this;
    var getWebElements = function() {
      return self.getWebElements().then(function(parentWebElements) {
        var i = index; 
        if (i < 0) {
          // wrap negative indices
          i = parentWebElements.length + i;
        }
        if (i < 0 || i >= parentWebElements.length) {
          throw new Error('Index out of bound. Trying to access element at ' +
              'index:' + index + ', but there are only ' +
              parentWebElements.length + ' elements');
        }
        return [parentWebElements[i]];
      });
    };
    return new ElementArrayFinder(getWebElements, this.locator_).toElementFinder_();
  };

  /**
   * Get the first matching element for the ElementArrayFinder. This does not
   * actually retrieve the underlying element.
   *
   * @alias element.all(locator).first()
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * var first = element.all(by.css('.items li')).first();
   * expect(first.getText()).toBe('First');
   *
   * @return {ElementFinder} finder representing the first matching element
   */
  ElementArrayFinder.prototype.first = function() {
    return this.get(0);
  };

  /**
   * Get the last matching element for the ElementArrayFinder. This does not
   * actually retrieve the underlying element.
   *
   * @alias element.all(locator).last()
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * var last = element.all(by.css('.items li')).last();
   * expect(last.getText()).toBe('Third');
   *
   * @return {ElementFinder} finder representing the last matching element
   */
  ElementArrayFinder.prototype.last = function() {
    return this.get(-1);
  };

  /**
   * Shorthand function for finding arrays of elements by css.
   *
   * @type {function(string): ElementArrayFinder}
   */
  ElementArrayFinder.prototype.$$ = function(selector) {
    return this.all(webdriver.By.css(selector));
  };

  /**
   * Returns an ElementFinder representation of ElementArrayFinder. It ensures
   * that the ElementArrayFinder resolves to one and only one underlying element.
   *
   * @return {ElementFinder} An ElementFinder representation
   * @private
   */
  ElementArrayFinder.prototype.toElementFinder_ = function() {
    return new ElementFinder(this);
  };

  /**
   * Count the number of elements represented by the ElementArrayFinder.
   *
   * @alias element.all(locator).count()
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * var list = element.all(by.css('.items li'));
   * expect(list.count()).toBe(3);
   *
   * @return {!webdriver.promise.Promise} A promise which resolves to the
   *     number of elements matching the locator.
   */
  ElementArrayFinder.prototype.count = function() {
    return this.getWebElements().then(function(arr) {
      return arr.length;
    }, function(err) {
      if (err.code == webdriver.error.ErrorCode.NO_SUCH_ELEMENT) {
        return 0;
      } else {
        throw err;
      }
    });
  };

  /**
   * Returns the most relevant locator.
   * i.e.
   *     $('#ID1').locator() returns by.css('#ID1')
   *     $('#ID1').$('#ID2').locator() returns by.css('#ID2')
   *     $$('#ID1').filter(filterFn).get(0).click().locator() returns by.css('#ID1')
   * @return {webdriver.Locator}
   */
  ElementArrayFinder.prototype.locator = function() {
    return this.locator_;
  };

  /**
   * Apply an action function to every element in the ElementArrayFinder,
   * and return a new ElementArrayFinder that contains the results of the actions.
   *
   * @param {function(ElementFinder)} actionFn
   *
   * @return {ElementArrayFinder}
   * @private
   */
  ElementArrayFinder.prototype.applyAction_ = function(actionFn) {
    var callerError = new Error();
    var actionResults = this.getWebElements().then(function(arr) {
      var list = [];
      arr.forEach(function(webElem) {
        list.push(actionFn(webElem));
      });
      return webdriver.promise.all(list);
    }).then(null, function(e) {
      e.stack = e.stack + '\n' + callerError.stack;
      throw e;
    });
    return new ElementArrayFinder(this.getWebElements, this.locator_, actionResults);
  };

  /**
   * Represents the ElementArrayFinder as an array of ElementFinders.
   *
   * @return {Array.<ElementFinder>} Return a promise, which resolves to a list 
   *     of ElementFinders specified by the locator.
   */
  ElementArrayFinder.prototype.asElementFinders_ = function() {
    var self = this; 
    return this.getWebElements().then(function(arr) {
      var list = [];
      arr.forEach(function(webElem, index) {
        list.push(self.get(index));
      });
      return list; 
    });
  };

  /**
   * Retrieve the elements represented by the ElementArrayFinder. The input
   * function is passed to the resulting promise, which resolves to an
   * array of ElementFinders.
   *
   * @alias element.all(locator).then(thenFunction)
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * element.all(by.css('.items li')).then(function(arr) {
   *   expect(arr.length).toEqual(3);
   * });
   *
   * @param {function(Array.<ElementFinder>)} fn
   * @param {function(Error)} errorFn
   *
   * @type {webdriver.promise.Promise} a promise which will resolve to
   *     an array of ElementFinders represented by the ElementArrayFinder.
   */
  ElementArrayFinder.prototype.then = function(fn, errorFn) {
    if (this.actionResults_) {
      return this.actionResults_.then(fn, errorFn);
    } else {
      return this.asElementFinders_().then(fn, errorFn);
    }
  };

  /**
   * Calls the input function on each ElementFinder represented by the ElementArrayFinder.
   *
   * @alias element.all(locator).each(eachFunction)
   * @view
   * <ul class="items">
   *   <li>First</li>
   *   <li>Second</li>
   *   <li>Third</li>
   * </ul>
   *
   * @example
   * element.all(by.css('.items li')).each(function(element) {
   *   // Will print First, Second, Third.
   *   element.getText().then(console.log);
   * });
   *
   * @param {function(ElementFinder)} fn Input function
   */
  ElementArrayFinder.prototype.each = function(fn) {
    return this.asElementFinders_().then(function(arr) {
      arr.forEach(function(elementFinder, index) {
        fn(elementFinder, index);
      });
    });
  };

  /**
   * Apply a map function to each element within the ElementArrayFinder. The
   * callback receives the ElementFinder as the first argument and the index as
   * a second arg.
   *
   * @alias element.all(locator).map(mapFunction)
   * @view
   * <ul class="items">
   *   <li class="one">First</li>
   *   <li class="two">Second</li>
   *   <li class="three">Third</li>
   * </ul>
   *
   * @example
   * var items = element.all(by.css('.items li')).map(function(elm, index) {
   *   return {
   *     index: index,
   *     text: elm.getText(),
   *     class: elm.getAttribute('class')
   *   };
   * });
   * expect(items).toEqual([
   *   {index: 0, text: 'First', class: 'one'},
   *   {index: 1, text: 'Second', class: 'two'},
   *   {index: 2, text: 'Third', class: 'three'}
   * ]);
   *
   * @param {function(ElementFinder, number)} mapFn Map function that
   *     will be applied to each element.
   * @return {!webdriver.promise.Promise} A promise that resolves to an array
   *     of values returned by the map function.
   */
  ElementArrayFinder.prototype.map = function(mapFn) {
    return this.asElementFinders_().then(function(arr) {
      var list = [];
      arr.forEach(function(elementFinder, index) {
        var mapResult = mapFn(elementFinder, index);
        // All nested arrays and objects will also be fully resolved.
        webdriver.promise.fullyResolved(mapResult).then(function(resolved) {
          list.push(resolved);
        });
      });
      return list;
    });
  };

  /**
   * Apply a reduce function against an accumulator and every element found 
   * using the locator (from left-to-right). The reduce function has to reduce
   * every element into a single value (the accumulator). Returns promise of 
   * the accumulator. The reduce function receives the accumulator, current 
   * ElementFinder, the index, and the entire array of ElementFinders, 
   * respectively.
   *
   * @alias element.all(locator).reduce(reduceFn)
   * @view
   * <ul class="items">
   *   <li class="one">First</li>
   *   <li class="two">Second</li>
   *   <li class="three">Third</li>
   * </ul>
   *
   * @example
   * var value = element.all(by.css('.items li')).reduce(function(acc, elem) {
   *   return elem.getText().then(function(text) {
   *     return acc + text + ' ';
   *   });
   * });
   *
   * expect(value).toEqual('First Second Third ');
   *
   * @param {function(number, ElementFinder, number, Array.<ElementFinder>)} 
   *     reduceFn Reduce function that reduces every element into a single value.
   * @param {*} initialValue Initial value of the accumulator. 
   * @return {!webdriver.promise.Promise} A promise that resolves to the final
   *     value of the accumulator. 
   */
  ElementArrayFinder.prototype.reduce = function(reduceFn, initialValue) {
    var valuePromise = webdriver.promise.fulfilled(initialValue);
    return this.asElementFinders_().then(function(arr) {
      arr.forEach(function(elementFinder, index) {
        valuePromise = valuePromise.then(function(value) {
          return reduceFn(value, elementFinder, index, arr);
        });
      });
      return valuePromise;
    });
  };

  /**
   * Evaluates the input as if it were on the scope of the current underlying
   * elements.
   * @param {string} expression
   *
   * @return {ElementArrayFinder} which resolves to the
   *     evaluated expression for each underlying element.
   *     The result will be resolved as in
   *     {@link webdriver.WebDriver.executeScript}. In summary - primitives will
   *     be resolved as is, functions will be converted to string, and elements
   *     will be returned as a WebElement.
   */
  ElementArrayFinder.prototype.evaluate = function(expression) {
    var evaluationFn = function(webElem) {
      return webElem.getDriver().executeScript(
          clientSideScripts.evaluate, webElem, expression);
    };
    return this.applyAction_(evaluationFn);
  };

  /**
   * Determine if animation is allowed on the current underlying elements.
   * @param {string} value
   *
   * @return {ElementArrayFinder} which resolves to whether animation is allowed.
   */
  ElementArrayFinder.prototype.allowAnimations = function(value) {
    var allowAnimationsTestFn = function(webElem) {
      return webElem.getDriver().executeScript(
          clientSideScripts.allowAnimations, webElem, value);
    };
    return this.applyAction_(allowAnimationsTestFn);
  };

  /**
   * The ElementFinder simply represents a single element of an
   * ElementArrayFinder (and is more like a convenience object). As a result,
   * anything that can be done with an ElementFinder, can also be done using
   * an ElementArrayFinder.
   *
   * The ElementFinder can be treated as a WebElement for most purposes, in 
   * particular, you may perform actions (i.e. click, getText) on them as you
   * would a WebElement. ElementFinders extend Promise, and once an action 
   * is performed on an ElementFinder, the latest result from the chain can be 
   * accessed using then. Unlike a WebElement, an ElementFinder will wait for
   * angular to settle before performing finds or actions.
   *
   * ElementFinder can be used to build a chain of locators that is used to find
   * an element. An ElementFinder does not actually attempt to find the element 
   * until an action is called, which means they can be set up in helper files 
   * before the page is available. 
   *
   * @alias element(locator)
   * @view
   * <span>{{person.name}}</span>
   * <span ng-bind="person.email"></span>
   * <input type="text" ng-model="person.name"/>
   *
   * @example
   * // Find element with {{scopeVar}} syntax.
   * element(by.binding('person.name')).getText().then(function(name) {
   *   expect(name).toBe('Foo');
   * });
   *
   * // Find element with ng-bind="scopeVar" syntax.
   * expect(element(by.binding('person.email')).getText()).toBe('foo@bar.com');
   *
   * // Find by model.
   * var input = element(by.model('person.name'));
   * input.sendKeys('123');
   * expect(input.getAttribute('value')).toBe('Foo123');
   *
   * @constructor
   * @param {ElementArrayFinder} elementArrayFinder The ElementArrayFinder
   *     that this is branched from.
   * @return {ElementFinder}
   */
  var ElementFinder = function(elementArrayFinder) {
    if (!elementArrayFinder) {
      throw new Error('BUG: elementArrayFinder cannot be empty');
    }
    this.parentElementArrayFinder = elementArrayFinder;

    // This filter verifies that there is only 1 element returned by the 
    // elementArrayFinder. It will warn if there are more than 1 element and
    // throw an error if there are no elements.
    var getWebElements = function() {
      return elementArrayFinder.getWebElements().then(function(webElements) {
        if (webElements.length === 0) {
          throw new webdriver.error.Error(
              webdriver.error.ErrorCode.NO_SUCH_ELEMENT,
              'No element found using locator: ' +
                  elementArrayFinder.locator_.toString());
        } else {
          if (webElements.length > 1) {
            console.log('warning: more than one element found for locator ' +
                elementArrayFinder.locator_.toString() +
                ' - you may need to be more specific');
          }
          return [webElements[0]];
        }
      });
    };

    // Store a copy of the underlying elementArrayFinder, but with the more
    // restrictive getWebElements (which checks that there is only 1 element).
    this.elementArrayFinder_ = new ElementArrayFinder(
        getWebElements, elementArrayFinder.locator_,
        elementArrayFinder.actionResults_);

    // Decorate ElementFinder with webdriver functions. Simply calls the
    // underlying elementArrayFinder to perform these functions.
    var self = this;
    WEB_ELEMENT_FUNCTIONS.forEach(function(fnName) {
      self[fnName] = function() {
        return self.elementArrayFinder_[fnName].
            apply(self.elementArrayFinder_, arguments).toElementFinder_();
      };
    });
  };
  util.inherits(ElementFinder, webdriver.promise.Promise);

  /**
   * Create a shallow copy of ElementFinder.
   *
   * @return {!ElementFinder} A shallow copy of this.
   */
  ElementFinder.prototype.clone = function() {
    // A shallow copy is all we need since the underlying fields can never be
    // modified 
    return new ElementFinder(this.parentElementArrayFinder); 
  };

  /**
   * See ElementArrayFinder.prototype.locator
   * @return {webdriver.Locator}
   */
  ElementFinder.prototype.locator = function() {
    return this.elementArrayFinder_.locator();
  };

  /**
   * Returns the WebElement represented by this ElementFinder.
   * Throws the WebDriver error if the element doesn't exist.
   *
   * @example
   * The following three expressions are equivalent.
   *  - element(by.css('.parent')).getWebElement();
   *  - browser.waitForAngular(); browser.driver.findElement(by.css('.parent'));
   *  - browser.findElement(by.css('.parent'))
   *
   * @alias element(locator).getWebElement()
   * @return {webdriver.WebElement}
   */
  ElementFinder.prototype.getWebElement = function() {
    var id = this.elementArrayFinder_.getWebElements().then(
        function(parentWebElements) {
          return parentWebElements[0];
        });
    return new webdriver.WebElementPromise(ptor.driver, id);
  };

  /**
   * Access the underlying actionResult of ElementFinder. Implementation allows
   * ElementFinder to be used as a webdriver.promise.Promise
   * @param {function(webdriver.promise.Promise)} fn Function which takes
   *     the value of the underlying actionResult.
   *
   * @return {webdriver.promise.Promise} Promise which contains the results of 
   *     evaluating fn.
   */
  ElementFinder.prototype.then = function(fn, errorFn) {
    return this.elementArrayFinder_.then(function(actionResults) {
      if (!fn) {
        return actionResults[0];
      }
      return fn(actionResults[0]);
    }, errorFn);
  };

  /** 
   * Calls to element may be chained to find an array of elements within a parent.
   *
   * @alias element(locator).all(locator)
   * @view
   * <div class="parent">
   *   <ul>
   *     <li class="one">First</li>
   *     <li class="two">Second</li>
   *     <li class="three">Third</li>
   *   </ul>
   * </div>
   *
   * @example
   * var items = element(by.css('.parent')).all(by.tagName('li'))
   *
   * @param {webdriver.Locator} subLocator
   * @return {ElementArrayFinder}
   */
  ElementFinder.prototype.all = function(subLocator) {
    return this.elementArrayFinder_.all(subLocator);
  };

  /**
   * Calls to element may be chained to find elements within a parent.
   *
   * @alias element(locator).element(locator)
   * @view
   * <div class="parent">
   *   <div class="child">
   *     Child text
   *     <div>{{person.phone}}</div>
   *   </div>
   * </div>
   *
   * @example
   * // Chain 2 element calls.
   * var child = element(by.css('.parent')).
   *     element(by.css('.child'));
   * expect(child.getText()).toBe('Child text\n555-123-4567');
   *
   * // Chain 3 element calls.
   * var triple = element(by.css('.parent')).
   *     element(by.css('.child')).
   *     element(by.binding('person.phone'));
   * expect(triple.getText()).toBe('555-123-4567');
   *
   * @param {webdriver.Locator} subLocator
   * @return {ElementFinder}
   */
  ElementFinder.prototype.element = function(subLocator) {
    return this.all(subLocator).toElementFinder_();
  };

  /**
   * Shortcut for querying the document directly with css.
   *
   * @alias $$(cssSelector)
   * @view
   * <div class="count">
   *   <span class="one">First</span>
   *   <span class="two">Second</span>
   * </div>
   *
   * @example
   * // The following protractor expressions are equivalent.
   * var list = element.all(by.css('.count span'));
   * expect(list.count()).toBe(2);
   *
   * list = $$('.count span');
   * expect(list.count()).toBe(2);
   * expect(list.get(0).getText()).toBe('First');
   * expect(list.get(1).getText()).toBe('Second');
   *
   * @param {string} selector a css selector
   * @return {ElementArrayFinder} which identifies the
   *     array of the located {@link webdriver.WebElement}s.
   */
  ElementFinder.prototype.$$ = function(selector) {
    return this.all(webdriver.By.css(selector));
  };

  /**
   * Shortcut for querying the document directly with css.
   *
   * @alias $(cssSelector)
   * @view
   * <div class="count">
   *   <span class="one">First</span>
   *   <span class="two">Second</span>
   * </div>
   *
   * @example
   * var item = $('.count .two');
   * expect(item.getText()).toBe('Second');
   *
   * @param {string} selector A css selector
   * @return {ElementFinder} which identifies the located
   *     {@link webdriver.WebElement}
   */
  ElementFinder.prototype.$ = function(selector) {
    return this.element(webdriver.By.css(selector));
  };

  /**
   * Determine whether the element is present on the page.
   *
   * @view
   * <span>{{person.name}}</span>
   *
   * @example
   * // Element exists.
   * expect(element(by.binding('person.name')).isPresent()).toBe(true);
   *
   * // Element not present.
   * expect(element(by.binding('notPresent')).isPresent()).toBe(false);
   *
   * @return {ElementFinder} which resolves to whether
   *     the element is present on the page.
   */
  ElementFinder.prototype.isPresent = function() {
    return this.parentElementArrayFinder.count().then(function(count) {
      return !!count;
    });
  };

  /**
   * Override for WebElement.prototype.isElementPresent so that protractor waits
   * for Angular to settle before making the check.
   * 
   * @see ElementFinder.isPresent
   *
   * @param {webdriver.Locator} subLocator Locator for element to look for.
   * @return {ElementFinder} which resolves to whether
   *     the element is present on the page.
   */
  ElementFinder.prototype.isElementPresent = function(subLocator) {
    return this.element(subLocator).isPresent();
  };

  /**
   * Evaluates the input as if it were on the scope of the current element.
   * @param {string} expression
   *
   * @return {ElementFinder} which resolves to the evaluated expression.
   */
  ElementFinder.prototype.evaluate = function(expression) {
    return this.elementArrayFinder_.evaluate(expression).toElementFinder_();
  };

  /**
   * See ElementArrayFinder.prototype.allowAnimations.
   * @param {string} value
   *
   * @return {ElementFinder} which resolves to whether animation is allowed.
   */
  ElementFinder.prototype.allowAnimations = function(value) {
    return this.elementArrayFinder_.allowAnimations(value).toElementFinder_();
  };

  /**
   * Webdriver relies on this function to be present on Promises, so adding
   * this dummy function as we inherited from webdriver.promise.Promise, but
   * this function is irrelevant to our usage
   *
   * @return {boolean} Always false as ElementFinder is never in pending state.
   */
  ElementFinder.prototype.isPending = function() {
    return false;
  };

  var element = function(locator) {
    return new ElementArrayFinder().all(locator).toElementFinder_();
  };

  element.all = function(locator) {
    return new ElementArrayFinder().all(locator);
  };

  return element;
};

/**
 * @alias browser
 * @constructor
 * @extends {webdriver.WebDriver}
 * @param {webdriver.WebDriver} webdriver
 * @param {string=} opt_baseUrl A base URL to run get requests against.
 * @param {string=} opt_rootElement  Selector element that has an ng-app in
 *     scope.
 */
var Protractor = function(webdriverInstance, opt_baseUrl, opt_rootElement) {
  // These functions should delegate to the webdriver instance, but should
  // wait for Angular to sync up before performing the action. This does not
  // include functions which are overridden by protractor below.
  var methodsToSync = ['getCurrentUrl', 'getPageSource', 'getTitle'];

  // Mix all other driver functionality into Protractor.
  for (var method in webdriverInstance) {
    if(!this[method] && typeof webdriverInstance[method] == 'function') {
      if (methodsToSync.indexOf(method) !== -1) {
        mixin(this, webdriverInstance, method, this.waitForAngular.bind(this));
      } else {
        mixin(this, webdriverInstance, method);
      }
    }
  }
  var self = this;

  /**
   * The wrapped webdriver instance. Use this to interact with pages that do
   * not contain Angular (such as a log-in screen).
   *
   * @type {webdriver.WebDriver}
   */
  this.driver = webdriverInstance;

  /**
   * Helper function for finding elements.
   *
   * @type {function(webdriver.Locator): ElementFinder}
   */
  this.element = buildElementHelper(this);

  /**
   * Shorthand function for finding elements by css.
   *
   * @type {function(string): ElementFinder}
   */
  this.$ = function(selector) {
    return self.element(webdriver.By.css(selector));
  };

  /**
   * Shorthand function for finding arrays of elements by css.
   *
   * @type {function(string): ElementArrayFinder}
   */
  this.$$ = function(selector) {
    return self.element.all(webdriver.By.css(selector));
  };

  /**
   * All get methods will be resolved against this base URL. Relative URLs are =
   * resolved the way anchor tags resolve.
   *
   * @type {string}
   */
  this.baseUrl = opt_baseUrl || '';

  /**
   * The css selector for an element on which to find Angular. This is usually
   * 'body' but if your ng-app is on a subsection of the page it may be
   * a subelement.
   *
   * @type {string}
   */
  this.rootEl = opt_rootElement || 'body';

  /**
   * If true, Protractor will not attempt to synchronize with the page before
   * performing actions. This can be harmful because Protractor will not wait
   * until $timeouts and $http calls have been processed, which can cause
   * tests to become flaky. This should be used only when necessary, such as
   * when a page continuously polls an API using $timeout.
   *
   * @type {boolean}
   */
  this.ignoreSynchronization = false;

  /**
   * Timeout in milliseconds to wait for pages to load when calling `get`.
   *
   * @type {number}
   */
  this.getPageTimeout = DEFAULT_GET_PAGE_TIMEOUT;

  /**
   * An object that holds custom test parameters.
   *
   * @type {Object}
   */
  this.params = {};

  /**
   * The reset URL to use between page loads.
   *
   * @type {string}
   */
  this.resetUrl = DEFAULT_RESET_URL;

  /**
   * Information about mock modules that will be installed during every
   * get().
   *
   * @type {Array<{name: string, script: function|string, args: Array.<string>}>}
   */
  this.mockModules_ = [];

  this.addBaseMockModules_();
};

/**
 * The same as {@code webdriver.WebDriver.prototype.executeScript},
 * but with a customized description for debugging.
 *
 * @private
 * @param {!(string|Function)} script The script to execute.
 * @param {string} description A description of the command for debugging.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {!webdriver.promise.Promise.<T>} A promise that will resolve to the
 *    scripts return value.
 * @template T
 */
Protractor.prototype.executeScript_ = function(script, description) {
  if (typeof script === 'function') {
    script = 'return (' + script + ').apply(null, arguments);';
  }

  return this.driver.schedule(
      new webdriver.Command(webdriver.CommandName.EXECUTE_SCRIPT).
          setParameter('script', script).
          setParameter('args', Array.prototype.slice.call(arguments, 2)),
      description);
};

/**
 * The same as {@code webdriver.WebDriver.prototype.executeAsyncScript},
 * but with a customized description for debugging.
 *
 * @private
 * @param {!(string|Function)} script The script to execute.
 * @param {string} description A description for debugging purposes.
 * @param {...*} var_args The arguments to pass to the script.
 * @return {!webdriver.promise.Promise.<T>} A promise that will resolve to the
 *    scripts return value.
 * @template T
 */
Protractor.prototype.executeAsyncScript_ =
    function(script, description) {
      if (typeof script === 'function') {
        script = 'return (' + script + ').apply(null, arguments);';
      }
      return this.driver.schedule(
          new webdriver.Command(webdriver.CommandName.EXECUTE_ASYNC_SCRIPT).
              setParameter('script', script).
              setParameter('args', Array.prototype.slice.call(arguments, 2)),
          description);
    };

/**
 * Instruct webdriver to wait until Angular has finished rendering and has
 * no outstanding $http calls before continuing.
 *
 * @return {!webdriver.promise.Promise} A promise that will resolve to the
 *    scripts return value.
 */
Protractor.prototype.waitForAngular = function() {
  if (this.ignoreSynchronization) {
    return webdriver.promise.fulfilled();
  }
  return this.executeAsyncScript_(
      clientSideScripts.waitForAngular, 'Protractor.waitForAngular()',
      this.rootEl).
      then(function(browserErr) {
        if (browserErr) {
          throw 'Error while waiting for Protractor to ' +
                'sync with the page: ' + JSON.stringify(browserErr);
        }
    }).then(null, function(err) {
      var timeout;
      if (/asynchronous script timeout/.test(err.message)) {
        // Timeout on Chrome
        timeout = /-?[\d\.]*\ seconds/.exec(err.message);
      } else if (/Timed out waiting for async script/.test(err.message)) {
        // Timeout on Firefox
        timeout = /-?[\d\.]*ms/.exec(err.message);
      } else if (/Timed out waiting for an asynchronous script/.test(err.message)) {
        // Timeout on Safari
        timeout = /-?[\d\.]*\ ms/.exec(err.message);
      }
      if (timeout) {
        throw 'Timed out waiting for Protractor to synchronize with ' +
            'the page after ' + timeout + '. Please see ' +
            'https://github.com/angular/protractor/blob/master/docs/faq.md';
      } else {
        throw err;
      }
    });
};

/**
 * Waits for Angular to finish rendering before searching for elements.
 * @see webdriver.WebDriver.findElement
 * @return {!webdriver.WebElement}
 */
Protractor.prototype.findElement = function(locator) {
  return this.element(locator).getWebElement();
};

/**
 * Waits for Angular to finish rendering before searching for elements.
 * @see webdriver.WebDriver.findElements
 * @return {!webdriver.promise.Promise} A promise that will be resolved to an
 *     array of the located {@link webdriver.WebElement}s.
 */
Protractor.prototype.findElements = function(locator) {
  return this.element.all(locator).getWebElements();
};

/**
 * Tests if an element is present on the page.
 * @see webdriver.WebDriver.isElementPresent
 * @return {!webdriver.promise.Promise} A promise that will resolve to whether
 *     the element is present on the page.
 */
Protractor.prototype.isElementPresent = function(locatorOrElement) {
  var element = (locatorOrElement instanceof webdriver.promise.Promise) ? 
      locatorOrElement : this.element(locatorOrElement);
  return element.isPresent();
};

/**
 * Add a module to load before Angular whenever Protractor.get is called.
 * Modules will be registered after existing modules already on the page,
 * so any module registered here will override preexisting modules with the same
 * name.
 *
 * @param {!string} name The name of the module to load or override.
 * @param {!string|Function} script The JavaScript to load the module.
 * @param {...*} varArgs Any additional arguments will be provided to
 *     the script and may be referenced using the `arguments` object.
 */
Protractor.prototype.addMockModule = function(name, script) {
  var moduleArgs = Array.prototype.slice.call(arguments, 2);

  this.mockModules_.push({
    name: name,
    script: script,
    args: moduleArgs
  });
};

/**
 * Clear the list of registered mock modules.
 */
Protractor.prototype.clearMockModules = function() {
  this.mockModules_ = [];
  this.addBaseMockModules_();
};

/**
 * Remove a registered mock module.
 * @param {!string} name The name of the module to remove.
 */
Protractor.prototype.removeMockModule = function(name) {
  for (var i = 0; i < this.mockModules_.length; ++i) {
    if (this.mockModules_[i].name == name) {
      this.mockModules_.splice(i, 1);
    }
  }
};

/**
 * Add the base mock modules used for all Protractor tests.
 *
 * @private
 */
Protractor.prototype.addBaseMockModules_ = function() {
  this.addMockModule('protractorBaseModule_', function() {
    angular.module('protractorBaseModule_', []).
        config(['$compileProvider', function($compileProvider) {
          if ($compileProvider.debugInfoEnabled) {
            $compileProvider.debugInfoEnabled(true);
          }
        }]);
  });
};

/**
 * See webdriver.WebDriver.get
 *
 * Navigate to the given destination and loads mock modules before
 * Angular. Assumes that the page being loaded uses Angular.
 * If you need to access a page which does not have Angular on load, use
 * the wrapped webdriver directly.
 *
 * @param {string} destination Destination URL.
 * @param {number=} opt_timeout Number of milliseconds to wait for Angular to
 *     start.
 */
Protractor.prototype.get = function(destination, opt_timeout) {
  var timeout = opt_timeout ? opt_timeout : this.getPageTimeout;
  var self = this;

  destination = this.baseUrl.indexOf('file://') === 0 ?
    this.baseUrl + destination : url.resolve(this.baseUrl, destination);
  var msg = function(str) {
    return 'Protractor.get(' + destination + ') - ' + str;
  };

  if (this.ignoreSynchronization) {
    return this.driver.get(destination);
  }

  this.driver.get(this.resetUrl);
  this.executeScript_(
      'window.name = "' + DEFER_LABEL + '" + window.name;' +
      'window.location.replace("' + destination + '");',
      msg('reset url'));

  // We need to make sure the new url has loaded before
  // we try to execute any asynchronous scripts.
  this.driver.wait(function() {
    return self.executeScript_('return window.location.href;', msg('get url')).
        then(function(url) {
          return url !== self.resetUrl;
        }, function(err) {
          if (err.code == 13) {
            // Ignore the error, and continue trying. This is because IE
            // driver sometimes (~1%) will throw an unknown error from this
            // execution. See https://github.com/angular/protractor/issues/841
            // This shouldn't mask errors because it will fail with the timeout
            // anyway.
            return false;
          } else {
            throw err;
          }
        });
  }, timeout,
  'waiting for page to load for ' + timeout + 'ms');

  // Make sure the page is an Angular page.
  self.executeAsyncScript_(clientSideScripts.testForAngular,
      msg('test for angular'),
      Math.floor(timeout / 1000)).
      then(function(angularTestResult) {
        var hasAngular = angularTestResult[0];
        if (!hasAngular) {
          var message = angularTestResult[1];
          throw new Error('Angular could not be found on the page ' +
              destination + ' : ' + message);
        }
      }, function(err) {
        throw 'Error while running testForAngular: ' + err.message;
      });

  // At this point, Angular will pause for us until angular.resumeBootstrap
  // is called.
  var moduleNames = [];
  for (var i = 0; i < this.mockModules_.length; ++i) {
    var mockModule = this.mockModules_[i];
    var name = mockModule.name;
    moduleNames.push(name);
    var executeScriptArgs = [mockModule.script, msg('add mock module ' + name)].
        concat(mockModule.args);
    this.executeScript_.apply(this, executeScriptArgs).
        then(null, function(err) {
          throw 'Error while running module script ' + name +
              ': ' + err.message;
        });
  }

  return this.executeScript_(
      'angular.resumeBootstrap(arguments[0]);',
      msg('resume bootstrap'),
      moduleNames);
};

/**
 * See webdriver.WebDriver.refresh
 *
 * Makes a full reload of the current page and loads mock modules before
 * Angular. Assumes that the page being loaded uses Angular.
 * If you need to access a page which does not have Angular on load, use
 * the wrapped webdriver directly.
 *
 * @param {number=} opt_timeout Number of seconds to wait for Angular to start.
 */
Protractor.prototype.refresh = function(opt_timeout) {
  var timeout = opt_timeout || 10;
  var self = this;

  if (self.ignoreSynchronization) {
    return self.driver.navigate().refresh();
  }

  return self.executeScript_(
      'return window.location.href',
      'Protractor.refresh() - getUrl').then(function(href) {
        return self.get(href, timeout);
      });
};

/**
 * Mixin navigation methods back into the navigation object so that
 * they are invoked as before, i.e. driver.navigate().refresh()
 */
Protractor.prototype.navigate = function() {
  var nav = this.driver.navigate();
  mixin(nav, this, 'refresh');
  return nav;
};

/**
 * Browse to another page using in-page navigation.
 *
 * @param {string} url In page URL using the same syntax as $location.url()
 * @returns {!webdriver.promise.Promise} A promise that will resolve once
 *    page has been changed.
 */
Protractor.prototype.setLocation = function(url) {
  this.waitForAngular();
  return this.executeScript_(clientSideScripts.setLocation,
    'Protractor.setLocation()', this.rootEl, url).then(function(browserErr) {
      if (browserErr) {
        throw 'Error while navigating to \'' + url + '\' : ' +
            JSON.stringify(browserErr);
      }
    });
};

/**
 * Returns the current absolute url from AngularJS.
 */
Protractor.prototype.getLocationAbsUrl = function() {
  this.waitForAngular();
  return this.executeScript_(clientSideScripts.getLocationAbsUrl,
      'Protractor.getLocationAbsUrl()', this.rootEl);
};

/**
 * Pauses the test and injects some helper functions into the browser, so that
 * debugging may be done in the browser console.
 *
 * This should be used under node in debug mode, i.e. with
 * protractor debug <configuration.js>
 *
 * @example
 * While in the debugger, commands can be scheduled through webdriver by
 * entering the repl:
 *   debug> repl
 *   Press Ctrl + C to leave rdebug repl
 *   > ptor.findElement(protractor.By.input('user').sendKeys('Laura'));
 *   > ptor.debugger();
 *   debug> c
 *
 * This will run the sendKeys command as the next task, then re-enter the
 * debugger.
 */
Protractor.prototype.debugger = function() {
  // jshint debug: true
  this.driver.executeScript(clientSideScripts.installInBrowser);
  webdriver.promise.controlFlow().execute(function() { debugger; },
                                          'add breakpoint to control flow');
};

/**
 * Beta (unstable) pause function for debugging webdriver tests. Use
 * browser.pause() in your test to enter the protractor debugger from that
 * point in the control flow.
 * Does not require changes to the command line (no need to add 'debug').
 *
 * @param {number=} opt_debugPort Optional port to use for the debugging process
 */
Protractor.prototype.pause = function(opt_debugPort) {
  // Patch in a function to help us visualize what's going on in the control
  // flow.
  webdriver.promise.ControlFlow.prototype.getControlFlowText = function() {
    var descriptions = [];

    var getDescriptions = function(frameOrTask, descriptions) {
      if (frameOrTask.getDescription) {
        var getRelevantStack = function(stack) {
          return stack.filter(function(line) {
            var include = true;
            for (var i = 0; i < STACK_SUBSTRINGS_TO_FILTER.length; ++i) {
              if (line.toString().indexOf(STACK_SUBSTRINGS_TO_FILTER[i]) !==
                  -1) {
                include = false;
              }
            }
            return include;
          });
        };
        descriptions.push({
          description: frameOrTask.getDescription(),
          stack: getRelevantStack(frameOrTask.snapshot_.getStacktrace())
        });
      } else {
        for (var i = 0; i < frameOrTask.children_.length; ++i) {
          getDescriptions(frameOrTask.children_[i], descriptions);
        }
      }
    };
    if (this.history_.length) {
      getDescriptions(this.history_[this.history_.length - 1], descriptions);
    }
    if (this.activeFrame_.getPendingTask()) {
      getDescriptions(this.activeFrame_.getPendingTask(), descriptions);
    }
    getDescriptions(this.activeFrame_.getRoot(), descriptions);
    var asString = '-- WebDriver control flow schedule \n';
    for (var i = 0; i < descriptions.length; ++i) {
      asString += ' |- ' + descriptions[i].description;
      if (descriptions[i].stack.length) {
        asString += '\n |---' + descriptions[i].stack.join('\n |---');
      }
      if (i != (descriptions.length - 1)) {
        asString += '\n';
      }
    }
    return asString;
  };

  if (opt_debugPort) {
    process.debugPort = opt_debugPort;
  }

  // Call this private function instead of sending SIGUSR1 because Windows.
  process._debugProcess(process.pid);
  var flow = webdriver.promise.controlFlow();

  flow.execute(function() {
    console.log('Starting WebDriver debugger in a child process. Pause is ' +
        'still beta, please report issues at github.com/angular/protractor');
    var nodedebug = require('child_process').
        fork(__dirname + '/wddebugger.js', [process.debugPort]);
    process.on('exit', function() {
      nodedebug.kill('SIGTERM');
    });
  });
  flow.timeout(1000, 'waiting for debugger to attach');
};

/**
 * Create a new instance of Protractor by wrapping a webdriver instance.
 *
 * @param {webdriver.WebDriver} webdriver The configured webdriver instance.
 * @param {string=} opt_baseUrl A URL to prepend to relative gets.
 * @return {Protractor}
 */
exports.wrapDriver = function(webdriver, opt_baseUrl, opt_rootElement) {
  return new Protractor(webdriver, opt_baseUrl, opt_rootElement);
};

/**
 * @type {Protractor}
 */
var instance;

/**
 * Set a singleton instance of protractor.
 * @param {Protractor} ptor
 */
exports.setInstance = function(ptor) {
  instance = ptor;
};

/**
 * Get the singleton instance.
 * @return {Protractor}
 */
exports.getInstance = function() {
  return instance;
};

/**
 * Utility function that filters a stack trace to be more readable. It removes
 * Jasmine test frames and webdriver promise resolution.
 * @param {string} text Original stack trace.
 * @return {string}
 */
exports.filterStackTrace = function(text) {
  if (!text) {
    return text;
  }
  var lines = [];
  text.split(/\n/).forEach(function(line) {
    var include = true;
    for (var i = 0; i < STACK_SUBSTRINGS_TO_FILTER.length; ++i) {
      if (line.indexOf(STACK_SUBSTRINGS_TO_FILTER[i]) !== -1) {
        include = false;
      }
    }
    if (include) {
      lines.push(line);
    }
  });
  return lines.join('\n');
};
