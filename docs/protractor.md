##[element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L65)

The element function returns an Element Finder. Element Finders do
not actually attempt to find the element until a method is called on them,
which means they can be set up in helper files before the page is
available.


###Example

```html
<span>{{person.name}}</span>
<span ng-bind="person.email"></span>
<input type="text" ng-model="person.name"/>
```

```javascript
// Find element with {{scopeVar}} syntax.
element(by.binding('person.name')).getText().then(function(name) {
  expect(name).toBe('Foo');
});
// Find element with ng-bind="scopeVar" syntax.
expect(element(by.binding('person.email')).getText()).toBe('foo@bar.com');
// Find by model.
var input = element(by.model('person.name'));
input.sendKeys('123');
expect(input.getAttribute('value')).toBe('Foo123');
```



###Params

Param | Type | Description
--- | --- | ---
locator | webdriver.Locator | An element locator.




###Returns

Type | Description
--- | ---
ElementFinder | 


##[elementFinder.find](https://github.com/angular/protractor/blob/master/lib/protractor.js#L114)
####element(locator).find()
Return the actual WebElement.






###Returns

Type | Description
--- | ---
webdriver.WebElement | 


##[elementFinder.isPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L124)
####element(locator).isPresent()
Determine whether an element is present on the page.


###Example

```html
<span>{{person.name}}</span>
```

```javascript
// Element exists.
var item = element(by.binding('person.name'));
expect(item.isPresent()).toBe(true);
item.isPresent().then(function(present) {
  expect(present).toBe(true);
});
// Element not present.
expect(element(by.binding('notPresent')).isPresent()).toBe(false);
```





###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise which resolves to a boolean.


##[elementFinder.element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L149)
####element(locator).element()
Calls to element may be chained to find elements within a parent.


###Example

```html
<div class="parent">
  <div class="child">
    Child text
    <div>{{person.phone}}</div>
  </div>
</div>
```

```javascript
// Chain 2 element calls.
var child = element(by.css('.parent')).
    element(by.css('.child'));
expect(child.getText()).toBe('Child text\n555-123-4567');
// Chain 3 element calls.
var triple = element(by.css('.parent')).
    element(by.css('.child')).
    element(by.binding('person.phone'));
expect(triple.getText()).toBe('555-123-4567');
```



###Params

Param | Type | Description
--- | --- | ---
ptor | Protractor | null
opt_usingChain | Array.&lt;webdriver.Locator&gt; | null




###Returns

Type | Description
--- | ---
function (webdriver.Locator): ElementFinder | 


##[elementFinder.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L179)
####element(locator).$()
Shortcut for chaining css element finders.


###Example

```html
<div class="parent">
  <div class="child">
    Child text
    <div class="grandchild">{{person.phone}}</div>
  </div>
</div>
```

```javascript
// Chain 2 element calls.
var child = element(by.css('.parent')).$('.child');
expect(child.getText()).toBe('Child text\n555-123-4567');
// Chain 3 element calls.
var triple = $('.parent').$('.child').$('.grandchild');
expect(triple.getText()).toBe('555-123-4567');
```



###Params

Param | Type | Description
--- | --- | ---
cssSelector | string | A css selector.




###Returns

Type | Description
--- | ---
ElementFinder | 


##[element.all](https://github.com/angular/protractor/blob/master/lib/protractor.js#L210)

element.all is used for operations on an array of elements (as opposed
to a single element).


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).then(function(items) {
  expect(items.length).toBe(3);
  expect(items[0].getText()).toBe('First');
});
```



###Params

Param | Type | Description
--- | --- | ---
locator | webdriver.Locator | null




###Returns

Type | Description
--- | ---
ElementArrayFinder | 


##[elementArrayFinder.count](https://github.com/angular/protractor/blob/master/lib/protractor.js#L233)
####element.all(locator).count()
Count the number of elements found by the locator.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).count().then(function(count) {
  expect(count).toBe(3);
});
expect(element.all(by.css('.items li')).count()).toBe(3);
```





###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise which resolves to the number of elements matching the locator.


##[elementArrayFinder.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L259)
####element.all(locator).get()
Get an element found by the locator by index. The index starts at 0.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).get(0).then(function(element) {
  expect(element.getText()).toBe('First');
});
expect(element.all(by.css('.items li')).get(1).getText()).toBe('Second');
```



###Params

Param | Type | Description
--- | --- | ---
index | number | Element index.




###Returns

Type | Description
--- | ---
webdriver.WebElement | The element at the given index


##[elementArrayFinder.first](https://github.com/angular/protractor/blob/master/lib/protractor.js#L286)
####element.all(locator).first()
Get the first element found using the locator.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).first().then(function(first) {
  expect(first.getText()).toBe('First');
});
expect(element.all(by.css('.items li')).first().getText()).toBe('First');
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | The first matching element


##[elementArrayFinder.last](https://github.com/angular/protractor/blob/master/lib/protractor.js#L315)
####element.all().last()
Get the last matching element for the locator.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).last().then(function(last) {
  expect(last.getText()).toBe('Third');
});
expect(element.all(by.css('.items li')).last().getText()).toBe('Third');
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | the last matching element


##[elementArrayFinder.each](https://github.com/angular/protractor/blob/master/lib/protractor.js#L349)
####element.all().each()
Calls the input function on each WebElement found by the locator.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).each(function(element) {
  // Will print First, Second, Third.
  element.getText().then(console.log);
});
```



###Params

Param | Type | Description
--- | --- | ---
fn | function (webdriver.WebElement) | Input function





##[elementArrayFinder.map](https://github.com/angular/protractor/blob/master/lib/protractor.js#L376)
####element.all(locator).map()
Apply a map function to each element found using the locator. The
callback receives the web element as the first argument and the index as
a second arg.


###Example

```html
<ul class="items">
  <li class="one">First</li>
  <li class="two">Second</li>
  <li class="three">Third</li>
</ul>
```

```javascript
var items = element.all(by.css('.items li')).map(function(elm, index) {
  return {
    index: index,
    text: elm.getText(),
    class: elm.getAttribute('class')
  };
});
expect(items).toEqual([
  {index: 0, text: 'First', class: 'one'},
  {index: 1, text: 'Second', class: 'two'},
  {index: 2, text: 'Third', class: 'three'}
]);
```



###Params

Param | Type | Description
--- | --- | ---
mapFn | function (webdriver.WebElement, number) | Map function that will be applied to each element.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to an array of values returned by the map function.


##[Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js#L454)






###Params

Param | Type | Description
--- | --- | ---
webdriver | webdriver.WebDriver | null
opt_baseUrl | string | A base URL to run get requests against.





##[Protractor.prototype.waitForAngular](https://github.com/angular/protractor/blob/master/lib/protractor.js#L547)

Instruct webdriver to wait until Angular has finished rendering and has
no outstanding $http calls before continuing.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[Protractor.prototype.wrapWebElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L588)

Wrap a webdriver.WebElement with protractor specific functionality.




###Params

Param | Type | Description
--- | --- | ---
element | webdriver.WebElement | null




###Returns

Type | Description
--- | ---
webdriver.WebElement | the wrapped web element.


##[element.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L611)
####$()
Shortcut for querying the document directly with css.


###Example

```html
<div class="count">
  <span class="one">First</span>
  <span class="two">Second</span>
</div>
```

```javascript
var item = $('.count .two');
expect(item.getText()).toBe('Second');
```



###Params

Param | Type | Description
--- | --- | ---
selector | string | A css selector




###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L634)








###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.$$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L651)

Shortcut for querying the document directly with css.




###Params

Param | Type | Description
--- | --- | ---
selector | string | a css selector




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L664)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L688)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether an element could be located on the page.


##[element.evaluate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L704)

Evalates the input as if it were on the scope of the current element.




###Params

Param | Type | Description
--- | --- | ---
expression | string | null




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the evaluated expression. The result will be resolved as in
    {@link webdriver.WebDriver.executeScript}. In summary - primitives will
    be resolved as is, functions will be converted to string, and elements
    will be returned as a WebElement.


##[Protractor.prototype.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L723)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[Protractor.prototype.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L741)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[Protractor.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L766)

Tests if an element is present on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to whether the element is present on the page.


##[Protractor.prototype.addMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L782)

Add a module to load before Angular whenever Protractor.get is called.
Modules will be registered after existing modules already on the page,
so any module registered here will override preexisting modules with the same
name.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to load or override.
script | (!string&#124;Function) | The JavaScript to load the module.





##[Protractor.prototype.clearMockModules](https://github.com/angular/protractor/blob/master/lib/protractor.js#L796)

Clear the list of registered mock modules.







##[Protractor.prototype.removeMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L804)

Remove a registered mock module.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to remove.





##[Protractor.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L814)

See webdriver.WebDriver.get

Navigate to the given destination and loads mock modules before
Angular. Assumes that the page being loaded uses Angular.
If you need to access a page which does have Angular on load, use
the wrapped webdriver directly.




###Params

Param | Type | Description
--- | --- | ---
destination | string | Destination URL.





##[Protractor.prototype.getLocationAbsUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L881)

Returns the current absolute url from AngularJS.







##[Protractor.prototype.debugger](https://github.com/angular/protractor/blob/master/lib/protractor.js#L889)

Pauses the test and injects some helper functions into the browser, so that
debugging may be done in the browser console.

This should be used under node in debug mode, i.e. with
protractor debug <configuration.js>

While in the debugger, commands can be scheduled through webdriver by
entering the repl:
  debug> repl
  Press Ctrl + C to leave rdebug repl
  > ptor.findElement(protractor.By.input('user').sendKeys('Laura'));
  > ptor.debugger();
  debug> c

This will run the sendKeys command as the next task, then re-enter the
debugger.






