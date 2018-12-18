import {error as wderror} from 'selenium-webdriver';
import {ProtractorBrowser} from './browser';
import {ElementFinder} from './element';
import {falseIfMissing, passBoolean} from './util';

/**
 * Represents a library of canned expected conditions that are useful for
 * protractor, especially when dealing with non-angular apps.
 *
 * Each condition returns a function that evaluates to a promise. You may mix
 * multiple conditions using `and`, `or`, and/or `not`. You may also
 * mix these conditions with any other conditions that you write.
 *
 * See ExpectedCondition Class in Selenium WebDriver codebase.
 * http://seleniumhq.github.io/selenium/docs/api/java/org/openqa/selenium/support/ui/ExpectedConditions.html
 *
 *
 * @example
 * const EC = protractor.ExpectedConditions;
 * const button = $('#xyz');
 * const isClickable = EC.elementToBeClickable(button);
 *
 * await browser.get(URL);
 * await browser.wait(isClickable, 5000); //wait for an element to become clickable
 * await button.click();
 *
 * // You can define your own expected condition, which is a function that
 * // takes no parameter and evaluates to a promise of a boolean.
 * const urlChanged = async () => {
 *   return await browser.getCurrentUrl() === 'http://www.angularjs.org';
 * }
 *
 * // You can customize the conditions with EC.and, EC.or, and EC.not.
 * // Here's a condition to wait for url to change, $('abc') element to contain
 * // text 'bar', and button becomes clickable.
 * const condition = EC.and(urlChanged, EC.textToBePresentInElement($('abc'),
 * 'bar'), isClickable);
 * await browser.get(URL);
 * await browser.wait(condition, 5000); //wait for condition to be true.
 * await button.click();
 *
 * @alias ExpectedConditions
 * @constructor
 */
export class ProtractorExpectedConditions {
  constructor(public browser: ProtractorBrowser) {}

  /**
   * Negates the result of a promise.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * const titleIsNotFoo = EC.not(EC.titleIs('Foo'));
   * // Waits for title to become something besides 'foo'.
   * await browser.wait(titleIsNotFoo, 5000);
   *
   * @alias ExpectedConditions.not
   * @param {!function} expectedCondition
   *
   * @returns {!function} An expected condition that returns the negated value.
   */
  not(expectedCondition: Function): Function {
    return (): Function => {
      return expectedCondition().then((bool: boolean): boolean => {
        return !bool;
      });
    };
  }

  /**
   * Helper function that is equivalent to the logical_and if defaultRet==true,
   * or logical_or if defaultRet==false
   *
   * @private
   * @param {boolean} defaultRet
   * @param {Array.<Function>} fns An array of expected conditions to chain.
   *
   * @returns {!function} An expected condition that returns a promise which
   *     evaluates to the result of the logical chain.
   */
  logicalChain_(defaultRet: boolean, fns: Array<Function>): Function {
    let self = this;
    return (): boolean => {
      if (fns.length === 0) {
        return defaultRet;
      }
      let fn = fns[0];
      return fn().then((bool: boolean): boolean => {
        if (bool === defaultRet) {
          return self.logicalChain_(defaultRet, fns.slice(1))();
        } else {
          return !defaultRet;
        }
      });
    };
  }

  /**
   * Chain a number of expected conditions using logical_and, short circuiting
   * at the first expected condition that evaluates to false.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * const titleContainsFoo = EC.titleContains('Foo');
   * const titleIsNotFooBar = EC.not(EC.titleIs('FooBar'));
   * // Waits for title to contain 'Foo', but is not 'FooBar'
   * await browser.wait(EC.and(titleContainsFoo, titleIsNotFooBar), 5000);
   *
   * @alias ExpectedConditions.and
   * @param {Array.<Function>} args An array of expected conditions to 'and'
   * together.
   *
   * @returns {!function} An expected condition that returns a promise which
   *     evaluates to the result of the logical and.
   */
  and(...args: Function[]): Function {
    return this.logicalChain_(true, args);
  }

  /**
   * Chain a number of expected conditions using logical_or, short circuiting
   * at the first expected condition that evaluates to true.
   *
   * @alias ExpectedConditions.or
   * @example
   * const EC = protractor.ExpectedConditions;
   * const titleContainsFoo = EC.titleContains('Foo');
   * const titleContainsBar = EC.titleContains('Bar');
   * // Waits for title to contain either 'Foo' or 'Bar'
   * await browser.wait(EC.or(titleContainsFoo, titleContainsBar), 5000);
   *
   * @param {Array.<Function>} args An array of expected conditions to 'or'
   * together.
   *
   * @returns {!function} An expected condition that returns a promise which
   *     evaluates to the result of the logical or.
   */
  or(...args: Function[]): Function {
    return this.logicalChain_(false, args);
  }

  /**
   * Expect an alert to be present.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for an alert pops up.
   * await browser.wait(EC.alertIsPresent(), 5000);
   *
   * @alias ExpectedConditions.alertIsPresent
   * @returns {!function} An expected condition that returns a promise
   *     representing whether an alert is present.
   */
  alertIsPresent(): Function {
    return () => {
      return this.browser.driver.switchTo().alert().then(
          ():
              boolean => {
                return true;
              },
          (err: any) => {
            if (err instanceof wderror.NoSuchAlertError) {
              return false;
            } else {
              throw err;
            }
          });
    };
  }

  /**
   * An Expectation for checking an element is visible and enabled such that you
   * can click it.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'abc' to be clickable.
   * await browser.wait(EC.elementToBeClickable($('#abc')), 5000);
   *
   * @alias ExpectedConditions.elementToBeClickable
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is clickable.
   */
  elementToBeClickable(elementFinder: ElementFinder): Function {
    return this.and(this.visibilityOf(elementFinder), () => {
      return elementFinder.isEnabled().then(passBoolean, falseIfMissing);
    });
  }

  /**
   * An expectation for checking if the given text is present in the
   * element. Returns false if the elementFinder does not find an element.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'abc' to contain the text 'foo'.
   * await browser.wait(EC.textToBePresentInElement($('#abc'), 'foo'), 5000);
   *
   * @alias ExpectedConditions.textToBePresentInElement
   * @param {!ElementFinder} elementFinder The element to check
   * @param {!string} text The text to verify against
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the text is present in the element.
   */
  textToBePresentInElement(elementFinder: ElementFinder, text: string): Function {
    let hasText = () => {
      return elementFinder.getText().then((actualText: string): boolean => {
        // MSEdge does not properly remove newlines, which causes false
        // negatives
        return actualText.replace(/\r?\n|\r/g, '').indexOf(text) > -1;
      }, falseIfMissing);
    };
    return this.and(this.presenceOf(elementFinder), hasText);
  }

  /**
   * An expectation for checking if the given text is present in the element’s
   * value. Returns false if the elementFinder does not find an element.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'myInput' to contain the input 'foo'.
   * await browser.wait(EC.textToBePresentInElementValue($('#myInput'), 'foo'), 5000);
   *
   * @alias ExpectedConditions.textToBePresentInElementValue
   * @param {!ElementFinder} elementFinder The element to check
   * @param {!string} text The text to verify against
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the text is present in the element's value.
   */
  textToBePresentInElementValue(elementFinder: ElementFinder, text: string): Function {
    let hasText = () => {
      return elementFinder.getAttribute('value').then((actualText: string): boolean => {
        return actualText.indexOf(text) > -1;
      }, falseIfMissing);
    };
    return this.and(this.presenceOf(elementFinder), hasText);
  }

  /**
   * An expectation for checking that the title contains a case-sensitive
   * substring.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the title to contain 'foo'.
   * await browser.wait(EC.titleContains('foo'), 5000);
   *
   * @alias ExpectedConditions.titleContains
   * @param {!string} title The fragment of title expected
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the title contains the string.
   */
  titleContains(title: string): Function {
    return () => {
      return this.browser.driver.getTitle().then((actualTitle: string): boolean => {
        return actualTitle.indexOf(title) > -1;
      });
    };
  }

  /**
   * An expectation for checking the title of a page.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the title to be 'foo'.
   * await browser.wait(EC.titleIs('foo'), 5000);
   *
   * @alias ExpectedConditions.titleIs
   * @param {!string} title The expected title, which must be an exact match.
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the title equals the string.
   */
  titleIs(title: string): Function {
    return () => {
      return this.browser.driver.getTitle().then((actualTitle: string): boolean => {
        return actualTitle === title;
      });
    };
  }

  /**
   * An expectation for checking that the URL contains a case-sensitive
   * substring.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the URL to contain 'foo'.
   * await browser.wait(EC.urlContains('foo'), 5000);
   *
   * @alias ExpectedConditions.urlContains
   * @param {!string} url The fragment of URL expected
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the URL contains the string.
   */
  urlContains(url: string): Function {
    return () => {
      return this.browser.driver.getCurrentUrl().then((actualUrl: string): boolean => {
        return actualUrl.indexOf(url) > -1;
      });
    };
  }

  /**
   * An expectation for checking the URL of a page.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the URL to be 'foo'.
   * await browser.wait(EC.urlIs('foo'), 5000);
   *
   * @alias ExpectedConditions.urlIs
   * @param {!string} url The expected URL, which must be an exact match.
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the url equals the string.
   */
  urlIs(url: string): Function {
    return () => {
      return this.browser.driver.getCurrentUrl().then((actualUrl: string): boolean => {
        return actualUrl === url;
      });
    };
  }

  /**
   * An expectation for checking that an element is present on the DOM
   * of a page. This does not necessarily mean that the element is visible.
   * This is the opposite of 'stalenessOf'.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'abc' to be present on the dom.
   * await browser.wait(EC.presenceOf($('#abc')), 5000);
   *
   * @alias ExpectedConditions.presenceOf
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is present.
   */
  presenceOf(elementFinder: ElementFinder): Function {
    return elementFinder.isPresent.bind(elementFinder);
  }

  /**
   * An expectation for checking that an element is not attached to the DOM
   * of a page. This is the opposite of 'presenceOf'.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'abc' to be no longer present on the dom.
   * await browser.wait(EC.stalenessOf($('#abc')), 5000);
   *
   * @alias ExpectedConditions.stalenessOf
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is stale.
   */
  stalenessOf(elementFinder: ElementFinder): Function {
    return this.not(this.presenceOf(elementFinder));
  }

  /**
   * An expectation for checking that an element is present on the DOM of a
   * page and visible. Visibility means that the element is not only displayed
   * but also has a height and width that is greater than 0. This is the
   * opposite
   * of 'invisibilityOf'.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'abc' to be visible on the dom.
   * await browser.wait(EC.visibilityOf($('#abc')), 5000);
   *
   * @alias ExpectedConditions.visibilityOf
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is visible.
   */
  visibilityOf(elementFinder: ElementFinder): Function {
    return this.and(this.presenceOf(elementFinder), () => {
      return elementFinder.isDisplayed().then(passBoolean, falseIfMissing);
    });
  }

  /**
   * An expectation for checking that an element is either invisible or not
   * present on the DOM. This is the opposite of 'visibilityOf'.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'abc' to be no longer visible on the dom.
   * await browser.wait(EC.invisibilityOf($('#abc')), 5000);
   *
   * @alias ExpectedConditions.invisibilityOf
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is invisible.
   */
  invisibilityOf(elementFinder: ElementFinder): Function {
    return this.not(this.visibilityOf(elementFinder));
  }

  /**
   * An expectation for checking the selection is selected.
   *
   * @example
   * const EC = protractor.ExpectedConditions;
   * // Waits for the element with id 'myCheckbox' to be selected.
   * await browser.wait(EC.elementToBeSelected($('#myCheckbox')), 5000);
   *
   * @alias ExpectedConditions.elementToBeSelected
   * @param {!ElementFinder} elementFinder The element to check
   *
   * @returns {!function} An expected condition that returns a promise
   *     representing whether the element is selected.
   */
  elementToBeSelected(elementFinder: ElementFinder): Function {
    return this.and(this.presenceOf(elementFinder), () => {
      return elementFinder.isSelected().then(passBoolean, falseIfMissing);
    });
  }
}
