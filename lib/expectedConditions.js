var webdriver = require('selenium-webdriver');

/* globals browser */

/**
 * Represents a library of canned expected conditions that are useful for
 * protractor, especially when dealing with non-angular apps.
 *
 * Each condition returns a function that evaluates to a promise. You may mix
 * multiple conditions using `and`, `or`, and/or `not`. You may also
 * mix these conditions with any other conditions that you write.
 *
 * See https://selenium.googlecode.com/git/docs/api/java/org/openqa ...
 *     /selenium/support/ui/ExpectedConditions.html
 *
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * var button = $('#xyz');
 * var isClickable = EC.elementToBeClickable(button);
 *
 * browser.get(URL);
 * browser.wait(isClickable, 5000); //wait for an element to become clickable
 * button.click();
 *
 * // You can define your own expected condition, which is a function that
 * // takes no parameter and evaluates to a promise of a boolean.
 * var urlChanged = function() {
 *   return browser.getCurrentUrl().then(function(url) {
 *     return url === 'http://www.angularjs.org';
 *   });
 * };
 *
 * // You can customize the conditions with EC.and, EC.or, and EC.not.
 * // Here's a condition to wait for url to change, $('abc') element to contain
 * // text 'bar', and button becomes clickable.
 * var condition = EC.and(urlChanged, EC.textToBePresentInElement($('abc'), 'bar'), isClickable);
 * browser.get(URL);
 * browser.wait(condition, 5000); //wait for condition to be true.
 * button.click();
 *
 * @constructor
 */
var ExpectedConditions = function() {};

/**
 * Negates the result of a promise.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * var titleIsNotFoo = EC.not(EC.titleIs('Foo'));
 * // Waits for title to become something besides 'foo'.
 * browser.wait(titleIsNotFoo, 5000); 
 *
 * @param {!function} expectedCondition
 *
 * @return {!function} An expected condition that returns the negated value.
 */
ExpectedConditions.prototype.not = function(expectedCondition) {
  return function() {
    return expectedCondition.call().then(function(bool) {
      return !bool;
    });
  };
};

/**
 * Helper function that is equivalent to the logical_and if defaultRet==true,
 * or logical_or if defaultRet==false
 *
 * @private
 * @param {boolean} defaultRet
 * @param {Array.<Function>} fns An array of expected conditions to chain.
 *
 * @return {!function} An expected condition that returns a promise which
 *     evaluates to the result of the logical chain.
 */
ExpectedConditions.prototype.logicalChain_ = function(defaultRet, fns) {
  var self = this;
  return function() {
    if (fns.length === 0) {
      return defaultRet;
    }
    var fn = fns[0];
    return fn().then(function(bool) {
      if (bool === defaultRet) {
        return self.logicalChain_(defaultRet, fns.slice(1))();
      } else {
        return !defaultRet;
      }
    });
  };
};

/**
 * Chain a number of expected conditions using logical_and, short circuiting
 * at the first expected condition that evaluates to false.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * var titleContainsFoo = EC.titleContains('Foo');
 * var titleIsNotFooBar = EC.not(EC.titleIs('FooBar'));
 * // Waits for title to contain 'Foo', but is not 'FooBar'
 * browser.wait(EC.and(titleContainsFoo, titleIsNotFooBar), 5000); 
 * 
 * @param {Array.<Function>} fns An array of expected conditions to 'and' together.
 *
 * @return {!function} An expected condition that returns a promise which
 *     evaluates to the result of the logical and.
 */
ExpectedConditions.prototype.and = function() {
  var args = Array.prototype.slice.call(arguments);
  return this.logicalChain_(true, args);
};

/**
 * Chain a number of expected conditions using logical_or, short circuiting
 * at the first expected condition that evaluates to true.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * var titleContainsFoo = EC.titleContains('Foo');
 * var titleContainsBar = EC.titleContains('Bar');
 * // Waits for title to contain either 'Foo' or 'Bar'
 * browser.wait(EC.or(titleContainsFoo, titleContainsBar), 5000); 
 * 
 * @param {Array.<Function>} fns An array of expected conditions to 'or' together.
 *
 * @return {!function} An expected condition that returns a promise which
 *     evaluates to the result of the logical or.
 */
ExpectedConditions.prototype.or = function() {
  var args = Array.prototype.slice.call(arguments);
  return this.logicalChain_(false, args);
};

/**
 * Expect an alert to be present.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for an alert pops up.
 * browser.wait(EC.alertIsPresent(), 5000); 
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether an alert is present.
 */
ExpectedConditions.prototype.alertIsPresent = function() {
  return function() {
    return browser.switchTo().alert().then(function() {
      return true;
    }, function(err) {
      if (err.code == webdriver.error.ErrorCode.NO_SUCH_ALERT) {
        return false;
      } else {
        throw err;
      }
    });
  };
};

/**
 * An Expectation for checking an element is visible and enabled such that you
 * can click it.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'abc' to be clickable.
 * browser.wait(EC.elementToBeClickable($('#abc')), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the element is clickable.
 */
ExpectedConditions.prototype.elementToBeClickable = function(elementFinder) {
  return this.and(
      this.visibilityOf(elementFinder),
      elementFinder.isEnabled.bind(elementFinder));
};

/**
 * An expectation for checking if the given text is present in the
 * element. Returns false if the elementFinder does not find an element.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'abc' to contain the text 'foo'.
 * browser.wait(EC.textToBePresentInElement($('#abc'), 'foo'), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 * @param {!string} text The text to verify against
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the text is present in the element.
 */
ExpectedConditions.prototype.textToBePresentInElement = function(elementFinder, text) {
  var hasText = function() {
    return elementFinder.getText().then(function(actualText) {
      return actualText.indexOf(text) > -1;
    });
  };
  return this.and(this.presenceOf(elementFinder), hasText);
};

/**
 * An expectation for checking if the given text is present in the element’s
 * value. Returns false if the elementFinder does not find an element.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'myInput' to contain the input 'foo'.
 * browser.wait(EC.textToBePresentInElementValue($('#myInput'), 'foo'), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 * @param {!string} text The text to verify against
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the text is present in the element's value.
 */
ExpectedConditions.prototype.textToBePresentInElementValue = function(elementFinder, text) {
  var hasText = function() {
    return elementFinder.getAttribute('value').then(function(actualText) {
      return actualText.indexOf(text) > -1;
    });
  };
  return this.and(this.presenceOf(elementFinder), hasText);
};

/**
 * An expectation for checking that the title contains a case-sensitive
 * substring.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the title to contain 'foo'.
 * browser.wait(EC.titleContains('foo'), 5000); 
 *
 * @param {!string} title The fragment of title expected
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the title contains the string.
 */
ExpectedConditions.prototype.titleContains = function(title) {
  return function() {
    return browser.getTitle().then(function(actualTitle) {
      return actualTitle.indexOf(title) > -1;
    });
  };
};

/**
 * An expectation for checking the title of a page.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the title to be 'foo'.
 * browser.wait(EC.titleIs('foo'), 5000); 
 *
 * @param {!string} title The expected title, which must be an exact match.
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the title equals the string.
 */
ExpectedConditions.prototype.titleIs = function(title) {
  return function() {
    return browser.getTitle().then(function(actualTitle) {
      return actualTitle === title;
    });
  };
};

/**
 * An expectation for checking that an element is present on the DOM
 * of a page. This does not necessarily mean that the element is visible.
 * This is the opposite of 'stalenessOf'.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'abc' to be present on the dom.
 * browser.wait(EC.presenceOf($('#abc')), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the element is present.
 */
ExpectedConditions.prototype.presenceOf = function(elementFinder) {
  return elementFinder.isPresent.bind(elementFinder);
};

/**
 * An expectation for checking that an element is not attached to the DOM
 * of a page. This is the opposite of 'presenceOf'.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'abc' to be no longer present on the dom.
 * browser.wait(EC.stalenessOf($('#abc')), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the element is stale.
 */
ExpectedConditions.prototype.stalenessOf = function(elementFinder) {
  return this.not(this.presenceOf(elementFinder));
};

/**
 * An expectation for checking that an element is present on the DOM of a
 * page and visible. Visibility means that the element is not only displayed
 * but also has a height and width that is greater than 0. This is the opposite 
 * of 'invisibilityOf'.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'abc' to be visible on the dom.
 * browser.wait(EC.visibilityOf($('#abc')), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the element is visible.
 */
ExpectedConditions.prototype.visibilityOf = function(elementFinder) {
  return this.and(
    this.presenceOf(elementFinder),
    elementFinder.isDisplayed.bind(elementFinder));
};

/**
 * An expectation for checking that an element is either invisible or not
 * present on the DOM. This is the opposite of 'visibilityOf'.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'abc' to be no longer visible on the dom.
 * browser.wait(EC.invisibilityOf($('#abc')), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the element is invisible.
 */
ExpectedConditions.prototype.invisibilityOf = function(elementFinder) {
  return this.not(this.visibilityOf(elementFinder));
};

/**
 * An expectation for checking the selection is selected.
 *
 * @example
 * var EC = protractor.ExpectedConditions;
 * // Waits for the element with id 'myCheckbox' to be selected.
 * browser.wait(EC.elementToBeSelected($('#myCheckbox')), 5000); 
 *
 * @param {!ElementFinder} elementFinder The element to check
 *
 * @return {!function} An expected condition that returns a promise
 *     representing whether the element is selected.
 */
ExpectedConditions.prototype.elementToBeSelected = function(elementFinder) {
  return this.and(
    this.presenceOf(elementFinder),
    elementFinder.isSelected.bind(elementFinder));
};

module.exports = ExpectedConditions;

