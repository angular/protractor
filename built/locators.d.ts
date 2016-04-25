/**
 * webdriver's By is an enum of locator functions, so we must set it to
 * a prototype before inheriting from it.
 */
export declare class WebdriverBy {
}
export interface Locator extends webdriver.Locator {
    findElementsOverride?: (driver: webdriver.WebDriver, using: webdriver.WebElement, rootSelector: string) => webdriver.WebElement;
    row?: (index: number) => Locator;
    column?: (index: string) => Locator;
}
/**
 * The Protractor Locators. These provide ways of finding elements in
 * Angular applications by binding, model, etc.
 *
 * @alias by
 * @extends {webdriver.By}
 */
export declare class ProtractorBy extends WebdriverBy {
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
     * element(by.buttonTextSimple('Go!')).click();
     *
     * @alias by.addLocator(locatorName, functionOrScript)
     * @param {string} name The name of the new locator.
     * @param {Function|string} script A script to be run in the context of
     *     the browser. This script will be passed an array of arguments
     *     that contains any args passed into the locator followed by the
     *     element scoping the search and the css selector for the root angular
     *     element. It should return an array of elements.
     */
    addLocator(name: string, script: Function | string): void;
    /**
     * Find an element by text binding. Does a partial match, so any elements bound
     * to variables containing the input string will be returned.
     *
     * Note: For AngularJS version 1.2, the interpolation brackets, (usually {{}}),
     * are optionally allowed in the binding description string. For Angular version
     * 1.3+, they are not allowed, and no elements will be found if they are used.
     *
     * @view
     * <span>{{person.name}}</span>
     * <span ng-bind="person.email"></span>
     *
     * @example
     * var span1 = element(by.binding('person.name'));
     * expect(span1.getText()).toBe('Foo');
     *
     * var span2 = element(by.binding('person.email'));
     * expect(span2.getText()).toBe('foo@bar.com');
     *
     * // You can also use a substring for a partial match
     * var span1alt = element(by.binding('name'));
     * expect(span1alt.getText()).toBe('Foo');
     *
     * // This works for sites using Angular 1.2 but NOT 1.3
     * var deprecatedSyntax = element(by.binding('{{person.name}}'));
     *
     * @param {string} bindingDescriptor
     * @return {{findElementsOverride: findElementsOverride, toString: Function|string}}
     */
    binding(bindingDescriptor: string): Locator;
    /**
     * Find an element by exact binding.
     *
     * @view
     * <span>{{ person.name }}</span>
     * <span ng-bind="person-email"></span>
     * <span>{{person_phone|uppercase}}</span>
     *
     * @example
     * expect(element(by.exactBinding('person.name')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('person-email')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('person')).isPresent()).toBe(false);
     * expect(element(by.exactBinding('person_phone')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('person_phone|uppercase')).isPresent()).toBe(true);
     * expect(element(by.exactBinding('phone')).isPresent()).toBe(false);
     *
     * @param {string} bindingDescriptor
     * @return {{findElementsOverride: findElementsOverride, toString: Function|string}}
     */
    exactBinding(bindingDescriptor: string): Locator;
    /**
     * Find an element by ng-model expression.
     *
     * @alias by.model(modelName)
     * @view
     * <input type="text" ng-model="person.name">
     *
     * @example
     * var input = element(by.model('person.name'));
     * input.sendKeys('123');
     * expect(input.getAttribute('value')).toBe('Foo123');
     *
     * @param {string} model ng-model expression.
     */
    model(model: string): Locator;
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
     * @return {{findElementsOverride: findElementsOverride, toString: Function|string}}
     */
    buttonText(searchText: string): Locator;
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
     * @return {{findElementsOverride: findElementsOverride, toString: Function|string}}
     */
    partialButtonText(searchText: string): Locator;
    private byRepeaterInner(exact, repeatDescriptor);
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
     * var secondCat = element(by.repeater('cat in pets').row(1));
     *
     * // Returns the SPAN for the first cat's name.
     * var firstCatName = element(by.repeater('cat in pets').
     *     row(0).column('cat.name'));
     *
     * // Returns a promise that resolves to an array of WebElements from a column
     * var ages = element.all(
     *     by.repeater('cat in pets').column('cat.age'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // all top level elements repeated by the repeater. For 2 pets rows resolves
     * // to an array of 2 elements.
     * var rows = element.all(by.repeater('cat in pets'));
     *
     * // Returns a promise that resolves to an array of WebElements containing all
     * // the elements with a binding to the book's name.
     * var divs = element.all(by.repeater('book in library').column('book.name'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // the DIVs for the second book.
     * var bookInfo = element.all(by.repeater('book in library').row(1));
     *
     * // Returns the H4 for the first book's name.
     * var firstBookName = element(by.repeater('book in library').
     *     row(0).column('book.name'));
     *
     * // Returns a promise that resolves to an array of WebElements containing
     * // all top level elements repeated by the repeater. For 2 books divs
     * // resolves to an array of 4 elements.
     * var divs = element.all(by.repeater('book in library'));
     *
     * @param {string} repeatDescriptor
     * @return {{findElementsOverride: findElementsOverride, toString: Function|string}}
     */
    repeater(repeatDescriptor: string): Locator;
    /**
     * Find an element by exact repeater.
     *
     * @view
     * <li ng-repeat="person in peopleWithRedHair"></li>
     * <li ng-repeat="car in cars | orderBy:year"></li>
     *
     * @example
     * expect(element(by.exactRepeater('person in peopleWithRedHair')).isPresent())
     *     .toBe(true);
     * expect(element(by.exactRepeater('person in people')).isPresent()).toBe(false);
     * expect(element(by.exactRepeater('car in cars')).isPresent()).toBe(true);
     *
     * @param {string} repeatDescriptor
     * @return {{findElementsOverride: findElementsOverride, toString: Function|string}}
     */
    exactRepeater(repeatDescriptor: string): Locator;
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
     */
    cssContainingText(cssSelector: string, searchText: string): Locator;
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
     * expect(allOptions.count()).toEqual(2);
     * var firstOption = allOptions.first();
     * expect(firstOption.getText()).toEqual('red');
     *
     * @param {string} optionsDescriptor ng-options expression.
     */
    options(optionsDescriptor: string): Locator;
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
     * expect(spans.count()).toEqual(3);
     */
    deepCss(selector: string): Locator;
}
