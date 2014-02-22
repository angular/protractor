##[element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L65)

The element function returns an Element Finder. Element Finders do
not actually attempt to find the element until a method is called on them,
which means they can be set up in helper files before the page is
available.


###Example

```html
<input type="text" ng-model="name">
```

```javascript
var nameInput = element(by.model('name'));
nameInput.sendKeys('Jane Doe');
```



###Params

Param | Type | Description
--- | --- | ---
locator | webdriver.Locator | null




###Returns

Type | Description
--- | ---
ElementFinder | 


##[elementFinder.find](https://github.com/angular/protractor/blob/master/lib/protractor.js#L104)
####element(locator).find()
Return the actual WebElement.


###Example

```javascript
element(by.binding('planet.name')).find().then(function(webElement) {
});
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | 


##[elementFinder.isPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L118)
####element(locator).isElement()
Determine if an element is present.


###Example

```javascript
element(by.binding('greet')).isPresent().then(function(present) {
  expect(present).toBe(true);
});
```





###Returns

Type | Description
--- | ---
boolean | Whether the element is present on the page.


##[elementFinder.element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L133)
####element(locator).element()
Calls to element may be chained to find elements within a parent.


###Example

```html
<div id="container">
  <input type="text" ng-model="name"/>
</div>
```

```javascript
var name = element(by.id('container')).element(by.model('name'));
name.sendKeys('John Smith');
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


##[elementFinder.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L153)
####element(locator).$()
Shortcut for chaining css element finders.


###Example

```html
<div id="container">
  <input class="myclass" type="text"/>
</div>
```

```javascript
var name = element(by.id('container')).$('input.myclass');
name.sendKeys('John Smith');
```



###Params

Param | Type | Description
--- | --- | ---
cssSelector | string | null




###Returns

Type | Description
--- | ---
ElementFinder | 


##[element.all](https://github.com/angular/protractor/blob/master/lib/protractor.js#L177)

element.all is used for operations on an array of elements (as opposed
to a single element).


###Example

```html
<ul>
  <li>Jackie Chan</li>
  <li>Bruce Lee</li>
</ul>
```

```javascript
element.all(by.css('ul li')).then(function(resultsArray) {
  expect(resultsArray.length).toBe(2);
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


##[elementArrayFinder.count](https://github.com/angular/protractor/blob/master/lib/protractor.js#L198)
####element.all(locator).count()
Count the number of elements found by the locator.


###Example

```javascript
element.all(by.model('dayColor.color')).then(function(count) {
  expect(count).toBe(3);
});
```





###Returns

Type | Description
--- | ---
number | The number of elements matching the locator.


##[elementArrayFinder.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L215)
####element.all(locator).get()
Get an element found by the locator by index. The index starts at 0.


###Example

```javascript
element.all(by.binding('planet.name')).get(0).then(function(elem) {
});
```



###Params

Param | Type | Description
--- | --- | ---
index | number | Element index.




###Returns

Type | Description
--- | ---
webdriver.WebElement | The element at the given index


##[elementArrayFinder.first](https://github.com/angular/protractor/blob/master/lib/protractor.js#L233)
####element.all(locator).first()
Get the first element found using the locator.


###Example

```javascript
element.all(by.binding('planet.name')).first().then(function(elem) {
});
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | The first matching element


##[element.all().last()](https://github.com/angular/protractor/blob/master/lib/protractor.js#L253)

Get the last matching element for the locator.


###Example

```javascript
element.all(by.binding('planet.name')).last().then(function(elem) {
});
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | the last matching element


##[elementArrayFinder.each](https://github.com/angular/protractor/blob/master/lib/protractor.js#L278)
####element.all().each()
Calls the input function on each WebElement found by the locator.


###Example

```javascript
var colorList = element.all(by.model('color'));
  colorList.each(function(colorElement) {
});
```



###Params

Param | Type | Description
--- | --- | ---
fn | function (webdriver.WebElement) | Input function





##[elementArrayFinder.map](https://github.com/angular/protractor/blob/master/lib/protractor.js#L297)
####element.all(locator).map()
Apply a map function to each element found using the locator. The
callback receives the web element as the first argument and the index as
a second arg.


###Example

```html
<ul class="menu">
  <li class="one">1</li>
  <li class="two">2</li>
</ul>
```

```javascript
var items = element.all(by.css('.menu li')).map(function(elm, index) {
  return {
    index: index,
    text: elm.getText(),
    class: elm.getAttribute('class')
  };
});
expect(items).toEqual([
  {index: 0, text: '1', class: 'one'},
  {index: 1, text: '2', class: 'two'},
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


##[Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js#L373)






###Params

Param | Type | Description
--- | --- | ---
webdriver | webdriver.WebDriver | null
opt_baseUrl | string | A base URL to run get requests against.





##[Protractor.prototype.waitForAngular](https://github.com/angular/protractor/blob/master/lib/protractor.js#L466)

Instruct webdriver to wait until Angular has finished rendering and has
no outstanding $http calls before continuing.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[Protractor.prototype.wrapWebElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L507)

Wrap a webdriver.WebElement with protractor specific functionality.




###Params

Param | Type | Description
--- | --- | ---
element | webdriver.WebElement | null




###Returns

Type | Description
--- | ---
webdriver.WebElement | the wrapped web element.


##[element.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L530)

Shortcut for querying the document directly with css.




###Params

Param | Type | Description
--- | --- | ---
selector | string | a css selector




###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L542)








###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.$$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L559)

Shortcut for querying the document directly with css.




###Params

Param | Type | Description
--- | --- | ---
selector | string | a css selector




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L572)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L596)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether an element could be located on the page.


##[element.evaluate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L612)

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


##[Protractor.prototype.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L631)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[Protractor.prototype.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L649)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[Protractor.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L674)

Tests if an element is present on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to whether the element is present on the page.


##[Protractor.prototype.addMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L690)

Add a module to load before Angular whenever Protractor.get is called.
Modules will be registered after existing modules already on the page,
so any module registered here will override preexisting modules with the same
name.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to load or override.
script | (!string&#124;Function) | The JavaScript to load the module.





##[Protractor.prototype.clearMockModules](https://github.com/angular/protractor/blob/master/lib/protractor.js#L704)

Clear the list of registered mock modules.







##[Protractor.prototype.removeMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L712)

Remove a registered mock module.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to remove.





##[Protractor.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L722)

See webdriver.WebDriver.get

Navigate to the given destination and loads mock modules before
Angular. Assumes that the page being loaded uses Angular.
If you need to access a page which does have Angular on load, use
the wrapped webdriver directly.




###Params

Param | Type | Description
--- | --- | ---
destination | string | Destination URL.





##[Protractor.prototype.getLocationAbsUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L789)

Returns the current absolute url from AngularJS.







##[Protractor.prototype.debugger](https://github.com/angular/protractor/blob/master/lib/protractor.js#L797)

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






