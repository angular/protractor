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


##[elementFinder.find](https://github.com/angular/protractor/blob/master/lib/protractor.js#L116)
####element(locator).find()
Return the actual WebElement.






###Returns

Type | Description
--- | ---
webdriver.WebElement | 


##[elementFinder.isPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L126)
####element(locator).isPresent()
Determine whether an element is present on the page.


###Example

```html
<span>{{person.name}}</span>
```

```javascript
// Element exists.
expect(element(by.binding('person.name')).isPresent()).toBe(true);

// Element not present.
expect(element(by.binding('notPresent')).isPresent()).toBe(false);
```





###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise which resolves to a boolean.


##[elementFinder.element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L148)
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
ptor | Protractor | 
opt_usingChain | Array.&lt;webdriver.Locator&gt; | 




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


##[element.all](https://github.com/angular/protractor/blob/master/lib/protractor.js#L211)

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
locator | webdriver.Locator | 




###Returns

Type | Description
--- | ---
ElementArrayFinder | 


##[elementArrayFinder.count](https://github.com/angular/protractor/blob/master/lib/protractor.js#L234)
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
var list = element.all(by.css('.items li'));
expect(list.count()).toBe(3);
```





###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise which resolves to the number of elements matching the locator.


##[elementArrayFinder.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L258)
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
var list = element.all(by.css('.items li'));
expect(list.get(0).getText()).toBe('First');
expect(list.get(1).getText()).toBe('Second');
```



###Params

Param | Type | Description
--- | --- | ---
index | number | Element index.




###Returns

Type | Description
--- | ---
webdriver.WebElement | The element at the given index


##[elementArrayFinder.first](https://github.com/angular/protractor/blob/master/lib/protractor.js#L284)
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
var list = element.all(by.css('.items li'));
expect(list.first().getText()).toBe('First');
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | The first matching element


##[elementArrayFinder.last](https://github.com/angular/protractor/blob/master/lib/protractor.js#L311)
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
var list = element.all(by.css('.items li'));
expect(list.last().getText()).toBe('Third');
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | the last matching element


##[elementArrayFinder.each](https://github.com/angular/protractor/blob/master/lib/protractor.js#L343)
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





##[elementArrayFinder.map](https://github.com/angular/protractor/blob/master/lib/protractor.js#L370)
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


##[Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js#L448)






###Params

Param | Type | Description
--- | --- | ---
webdriver | webdriver.WebDriver | 
opt_baseUrl | string | A base URL to run get requests against.





##[Protractor.prototype.waitForAngular](https://github.com/angular/protractor/blob/master/lib/protractor.js#L541)

Instruct webdriver to wait until Angular has finished rendering and has
no outstanding $http calls before continuing.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[Protractor.prototype.wrapWebElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L582)

Wrap a webdriver.WebElement with protractor specific functionality.




###Params

Param | Type | Description
--- | --- | ---
element | webdriver.WebElement | 




###Returns

Type | Description
--- | ---
webdriver.WebElement | the wrapped web element.


##[element.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L605)
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


##[element.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L628)








###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.$$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L645)
####$$()
Shortcut for querying the document directly with css.


###Example

```html
<div class="count">
  <span class="one">First</span>
  <span class="two">Second</span>
</div>
```

```javascript
// The following protractor expressions are equivalent.
var list = element.all(by.css('.count span'));
expect(list.count()).toBe(2);

list = $$('.count span');
expect(list.count()).toBe(2);
expect(list.get(0).getText()).toBe('First');
expect(list.get(1).getText()).toBe('Second');
```



###Params

Param | Type | Description
--- | --- | ---
selector | string | a css selector




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L675)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L699)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether an element could be located on the page.


##[element.evaluate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L715)

Evalates the input as if it were on the scope of the current element.




###Params

Param | Type | Description
--- | --- | ---
expression | string | 




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the evaluated expression. The result will be resolved as in
    {@link webdriver.WebDriver.executeScript}. In summary - primitives will
    be resolved as is, functions will be converted to string, and elements
    will be returned as a WebElement.


##[Protractor.prototype.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L734)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[Protractor.prototype.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L752)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[Protractor.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L777)

Tests if an element is present on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to whether the element is present on the page.


##[Protractor.prototype.addMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L793)

Add a module to load before Angular whenever Protractor.get is called.
Modules will be registered after existing modules already on the page,
so any module registered here will override preexisting modules with the same
name.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to load or override.
script | (!string&#124;Function) | The JavaScript to load the module.





##[Protractor.prototype.clearMockModules](https://github.com/angular/protractor/blob/master/lib/protractor.js#L807)

Clear the list of registered mock modules.







##[Protractor.prototype.removeMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L815)

Remove a registered mock module.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to remove.





##[Protractor.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L825)

See webdriver.WebDriver.get

Navigate to the given destination and loads mock modules before
Angular. Assumes that the page being loaded uses Angular.
If you need to access a page which does have Angular on load, use
the wrapped webdriver directly.




###Params

Param | Type | Description
--- | --- | ---
destination | string | Destination URL.





##[Protractor.prototype.getLocationAbsUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L892)

Returns the current absolute url from AngularJS.







##[Protractor.prototype.debugger](https://github.com/angular/protractor/blob/master/lib/protractor.js#L900)

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






