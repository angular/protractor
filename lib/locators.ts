import {By, ByHash, WebDriver, WebElement} from 'selenium-webdriver';

let clientSideScripts = require('./clientsidescripts');

// Explicitly define webdriver.By.
// We do this because we want to inherit the static methods of webdriver.By, as opposed to
// inheriting from the webdriver.By class itself, which is actually analogous to ProtractorLocator.
export class WebdriverBy {
  className: (className: string) => By = By.className;
  css: (css: string) => By = By.css;
  id: (id: string) => By = By.id;
  linkText: (linkText: string) => By = By.linkText;
  js: (js: string|Function, ...var_args: any[]) => (webdriver: WebDriver) => Promise<any> = By.js;
  name: (name: string) => By = By.name;
  partialLinkText: (partialText: string) => By = By.partialLinkText;
  tagName: (tagName: string) => By = By.tagName;
  xpath: (xpath: string) => By = By.xpath;
}
export type WebDriverLocator = By | ByHash | Function;

// Protractor locator strategy
export interface ProtractorLocator {
  findElementsOverride:
      (driver: WebDriver, using: WebElement, rootSelector: string) => Promise<WebElement[]>;
  row?: (index: number) => Locator;
  column?: (index: string) => Locator;
  toString?: () => string;
}
export type Locator = ProtractorLocator | WebDriverLocator;

export function isProtractorLocator(x: Locator): x is ProtractorLocator {
  return x && (typeof(x as any).findElementsOverride === 'function');
}

/**
 * The Protractor Locators. These provide ways of finding elements in
 * Angular applications by binding, model, etc.
 *
 * @alias by
 * @extends {webdriver.By}
 */
export class ProtractorBy extends WebdriverBy {
  [key: string]: any;

  /**
   * Add a locator to this instance of ProtractorBy. This locator can then be
   * used with element(by.locatorName(args)).
   *
   * @view
   * <button ng-click="doAddition()">Go!</button>
   *
   * @example
   * // Add the custom locator.
   * by.addLocator('buttonTextSimple',
   *     function(buttonText, opt_parentElement, opt_rootSelector) {
   *   // This function will be serialized as a string and will execute in the
   *   // browser. The first argument is the text for the button. The second
   *   // argument is the parent element, if any.
   *   var using = opt_parentElement || document,
   *       buttons = using.querySelectorAll('button');
   *
   *   // Return an array of buttons with the text.
   *   return Array.prototype.filter.call(buttons, function(button) {
   *     return button.textContent === buttonText;
   *   });
   * });
   *
   * // Use the custom locator.
   * await element(by.buttonTextSimple('Go!')).click();
   *
   * @alias by.addLocator(locatorName, functionOrScript)
   * @param {string} name The name of the new locator.
   * @param {Function|string} script A script to be run in the context of
   *     the browser. This script will be passed an array of arguments
   *     that contains any args passed into the locator followed by the
   *     element scoping the search and the css selector for the root angular
   *     element. It should return an array of elements.
   */
  addLocator(name: string, script: Function|string) {
    this[name] = (...args: any[]): ProtractorLocator => {
      const locatorArguments = args;
      return {
        findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
            Promise<WebElement[]> => {
              let findElementArguments: any[] = [script];
              for (let i = 0; i < locatorArguments.length; i++) {
                findElementArguments.push(locatorArguments[i]);
              }
              findElementArguments.push(using);
              findElementArguments.push(rootSelector);

              return await driver.findElements(By.js.apply(By, findElementArguments));
            },
        toString: (): string => {
          return 'by.' + name + '("' + Array.prototype.join.call(locatorArguments, '", "') + '")';
        }
      };
    };
  }

  /**
   * Find an element by text binding. Does a partial match, so any elements
   * bound to variables containing the input string will be returned.
   *
   * Note: For AngularJS version 1.2, the interpolation brackets, (usually
   * {{}}), are optionally allowed in the binding description string. For
   * Angular version 1.3+, they are not allowed, and no elements will be found
   * if they are used.
   *
   * @view
   * <span>{{person.name}}</span>
   * <span ng-bind="person.email"></span>
   *
   * @example
   * var span1 = element(by.binding('person.name'));
   * expect(await span1.getText()).toBe('Foo');
   *
   * var span2 = element(by.binding('person.email'));
   * expect(await span2.getText()).toBe('foo@bar.com');
   *
   * // You can also use a substring for a partial match
   * var span1alt = element(by.binding('name'));
   * expect(await span1alt.getText()).toBe('Foo');
   *
   * // This works for sites using Angular 1.2 but NOT 1.3
   * var deprecatedSyntax = element(by.binding('{{person.name}}'));
   *
   * @param {string} bindingDescriptor
   * @returns {ProtractorLocator} location strategy
   */
  binding(bindingDescriptor: string): ProtractorLocator {
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return await driver.findElements(By.js(
                clientSideScripts.findBindings, bindingDescriptor, false, using, rootSelector));
          },
      toString: (): string => {
        return 'by.binding("' + bindingDescriptor + '")';
      }
    };
  }

  /**
   * Find an element by exact binding.
   *
   * @view
   * <span>{{ person.name }}</span>
   * <span ng-bind="person-email"></span>
   * <span>{{person_phone|uppercase}}</span>
   *
   * @example
   * expect(await element(by.exactBinding('person.name')).isPresent()).toBe(true);
   * expect(await element(by.exactBinding('person-email')).isPresent()).toBe(true);
   * expect(await element(by.exactBinding('person')).isPresent()).toBe(false);
   * expect(await element(by.exactBinding('person_phone')).isPresent()).toBe(true);
   * expect(await element(by.exactBinding('person_phone|uppercase')).isPresent()).toBe(true);
   * expect(await element(by.exactBinding('phone')).isPresent()).toBe(false);
   *
   * @param {string} bindingDescriptor
   * @returns {ProtractorLocator} location strategy
   */
  exactBinding(bindingDescriptor: string): ProtractorLocator {
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return await driver.findElements(By.js(
                clientSideScripts.findBindings, bindingDescriptor, true, using, rootSelector));
          },
      toString: (): string => {
        return 'by.exactBinding("' + bindingDescriptor + '")';
      }
    };
  }

  /**
   * Find an element by ng-model expression.
   *
   * @alias by.model(modelName)
   * @view
   * <input type="text" ng-model="person.name">
   *
   * @example
   * var input = element(by.model('person.name'));
   * await input.sendKeys('123');
   * expect(await input.getAttribute('value')).toBe('Foo123');
   *
   * @param {string} model ng-model expression.
   * @returns {ProtractorLocator} location strategy
   */
  model(model: string): ProtractorLocator {
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return await driver.findElements(
                By.js(clientSideScripts.findByModel, model, using, rootSelector));
          },
      toString: (): string => {
        return 'by.model("' + model + '")';
      }
    };
  }

  /**
   * Find a button by text.
   *
   * @view
   * <button>Save</button>
   *
   * @example
   * element(by.buttonText('Save'));
   *
   * @param {string} searchText
   * @returns {ProtractorLocator} location strategy
   */
  buttonText(searchText: string): ProtractorLocator {
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return driver.findElements(
                By.js(clientSideScripts.findByButtonText, searchText, using, rootSelector));
          },
      toString: (): string => {
        return 'by.buttonText("' + searchText + '")';
      }
    };
  }

  /**
   * Find a button by partial text.
   *
   * @view
   * <button>Save my file</button>
   *
   * @example
   * element(by.partialButtonText('Save'));
   *
   * @param {string} searchText
   * @returns {ProtractorLocator} location strategy
   */
  partialButtonText(searchText: string): ProtractorLocator {
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return driver.findElements(
                By.js(clientSideScripts.findByPartialButtonText, searchText, using, rootSelector));
          },
      toString: (): string => {
        return 'by.partialButtonText("' + searchText + '")';
      }
    };
  }

  // Generate either by.repeater or by.exactRepeater
  private byRepeaterInner(exact: boolean, repeatDescriptor: string): ProtractorLocator {
    let name = 'by.' + (exact ? 'exactR' : 'r') + 'epeater';
    return {
      findElementsOverride: async(
          driver: WebDriver, using: WebElement, rootSelector: string): Promise<WebElement[]> => {
        return driver.findElements(By.js(
            clientSideScripts.findAllRepeaterRows, repeatDescriptor, exact, using, rootSelector));
      },
      toString: (): string => {
        return name + '("' + repeatDescriptor + '")';
      },
      row: (index: number): ProtractorLocator => {
        return {
          findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
              Promise<WebElement[]> => {
                return await driver.findElements(By.js(
                    clientSideScripts.findRepeaterRows, repeatDescriptor, exact, index, using,
                    rootSelector));
              },
          toString: (): string => {
            return name + '(' + repeatDescriptor + '").row("' + index + '")"';
          },
          column: (binding: string): ProtractorLocator => {
            return {
              findElementsOverride:
                  async(driver: WebDriver, using: WebElement, rootSelector: string):
                      Promise<WebElement[]> => {
                        return driver.findElements(By.js(
                            clientSideScripts.findRepeaterElement, repeatDescriptor, exact, index,
                            binding, using, rootSelector));
                      },
              toString: (): string => {
                return name + '("' + repeatDescriptor + '").row("' + index + '").column("' +
                    binding + '")';
              }
            };
          }
        };
      },
      column: (binding: string): ProtractorLocator => {
        return {
          findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
              Promise<WebElement[]> => {
                return driver.findElements(By.js(
                    clientSideScripts.findRepeaterColumn, repeatDescriptor, exact, binding, using,
                    rootSelector));
              },
          toString: (): string => {
            return name + '("' + repeatDescriptor + '").column("' + binding + '")';
          },
          row: (index: number): ProtractorLocator => {
            return {
              findElementsOverride:
                  async(driver: WebDriver, using: WebElement, rootSelector: string):
                      Promise<WebElement[]> => {
                        return driver.findElements(By.js(
                            clientSideScripts.findRepeaterElement, repeatDescriptor, exact, index,
                            binding, using, rootSelector));
                      },
              toString: (): string => {
                return name + '("' + repeatDescriptor + '").column("' + binding + '").row("' +
                    index + '")';
              }
            };
          }
        };
      }
    };
  }

  /**
   * Find elements inside an ng-repeat.
   *
   * @view
   * <div ng-repeat="cat in pets">
   *   <span>{{cat.name}}</span>
   *   <span>{{cat.age}}</span>
   * </div>
   *
   * <div class="book-img" ng-repeat-start="book in library">
   *   <span>{{$index}}</span>
   * </div>
   * <div class="book-info" ng-repeat-end>
   *   <h4>{{book.name}}</h4>
   *   <p>{{book.blurb}}</p>
   * </div>
   *
   * @example
   * // Returns the DIV for the second cat.
   * let secondCat = element(by.repeater('cat in pets').row(1));
   *
   * // Returns the SPAN for the first cat's name.
   * let firstCatName = element(by.repeater('cat in pets').
   *     row(0).column('cat.name'));
   *
   * // Returns a promise that resolves to an array of WebElements from a column
   * let ages = element.all(by.repeater('cat in pets').column('cat.age'));
   *
   * // Returns a promise that resolves to an array of WebElements containing
   * // all top level elements repeated by the repeater. For 2 pets rows
   * // resolves to an array of 2 elements.
   * let rows = element.all(by.repeater('cat in pets'));
   *
   * // Returns a promise that resolves to an array of WebElements containing
   * // all the elements with a binding to the book's name.
   * let divs = element.all(by.repeater('book in library').column('book.name'));
   *
   * // Returns a promise that resolves to an array of WebElements containing
   * // the DIVs for the second book.
   * let bookInfo = element.all(by.repeater('book in library').row(1));
   *
   * // Returns the H4 for the first book's name.
   * let firstBookName = element(by.repeater('book in library').
   *     row(0).column('book.name'));
   *
   * // Returns a promise that resolves to an array of WebElements containing
   * // all top level elements repeated by the repeater. For 2 books divs
   * // resolves to an array of 4 elements.
   * let divs = element.all(by.repeater('book in library'));
   *
   * @param {string} repeatDescriptor
   * @returns {ProtractorLocator} location strategy
   */
  repeater(repeatDescriptor: string): ProtractorLocator {
    return this.byRepeaterInner(false, repeatDescriptor);
  }

  /**
   * Find an element by exact repeater.
   *
   * @view
   * <li ng-repeat="person in peopleWithRedHair"></li>
   * <li ng-repeat="car in cars | orderBy:year"></li>
   *
   * @example
   * expect(await element(by.exactRepeater('person in peopleWithRedHair')).isPresent()).toBe(true);
   * expect(await element(by.exactRepeater('person in people')).isPresent()).toBe(false);
   * expect(await element(by.exactRepeater('car in cars')).isPresent()).toBe(true);
   *
   * @param {string} repeatDescriptor
   * @returns {ProtractorLocator} location strategy
   */
  exactRepeater(repeatDescriptor: string): ProtractorLocator {
    return this.byRepeaterInner(true, repeatDescriptor);
  }

  /**
   * Find elements by CSS which contain a certain string.
   *
   * @view
   * <ul>
   *   <li class="pet">Dog</li>
   *   <li class="pet">Cat</li>
   * </ul>
   *
   * @example
   * // Returns the li for the dog, but not cat.
   * var dog = element(by.cssContainingText('.pet', 'Dog'));
   *
   * @param {string} cssSelector css selector
   * @param {string|RegExp} searchText text search
   * @returns {ProtractorLocator} location strategy
   */
  cssContainingText(cssSelector: string, searchText: string|RegExp): ProtractorLocator {
    searchText = (searchText instanceof RegExp) ? '__REGEXP__' + searchText.toString() : searchText;
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return await driver.findElements(By.js(
                clientSideScripts.findByCssContainingText, cssSelector, searchText, using,
                rootSelector));
          },
      toString: (): string => {
        return 'by.cssContainingText("' + cssSelector + '", "' + searchText + '")';
      }
    };
  }

  /**
   * Find an element by ng-options expression.
   *
   * @alias by.options(optionsDescriptor)
   * @view
   * <select ng-model="color" ng-options="c for c in colors">
   *   <option value="0" selected="selected">red</option>
   *   <option value="1">green</option>
   * </select>
   *
   * @example
   * var allOptions = element.all(by.options('c for c in colors'));
   * expect(await allOptions.count()).toEqual(2);
   * var firstOption = allOptions.first();
   * expect(await firstOption.getText()).toEqual('red');
   *
   * @param {string} optionsDescriptor ng-options expression.
   * @returns {ProtractorLocator} location strategy
   */
  options(optionsDescriptor: string): ProtractorLocator {
    return {
      findElementsOverride: async(driver: WebDriver, using: WebElement, rootSelector: string):
          Promise<WebElement[]> => {
            return await driver.findElements(
                By.js(clientSideScripts.findByOptions, optionsDescriptor, using, rootSelector));
          },
      toString: (): string => {
        return 'by.option("' + optionsDescriptor + '")';
      }
    };
  }

  /**
   * Find an element by css selector within the Shadow DOM.
   *
   * @alias by.deepCss(selector)
   * @view
   * <div>
   *   <span id="outerspan">
   *   <"shadow tree">
   *     <span id="span1"></span>
   *     <"shadow tree">
   *       <span id="span2"></span>
   *     </>
   *   </>
   * </div>
   * @example
   * var spans = element.all(by.deepCss('span'));
   * expect(await spans.count()).toEqual(3);
   *
   * @param {string} selector a css selector within the Shadow DOM.
   * @returns {Locator} location strategy
   */
  deepCss(selector: string): Locator {
    // TODO(julie): syntax will change from /deep/ to >>> at some point.
    // When that is supported, switch it here.
    return By.css('* /deep/ ' + selector);
  }
}
