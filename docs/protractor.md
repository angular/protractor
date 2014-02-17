##[element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L65)
The element function returns an Element Finder. Element Finders do
not actually attempt to find the element until a method is called on them,
which means they can be set up in helper files before the page is
available.




###Example
```javascript
    var nameInput = element(by.model('name'));
    browser.get('myurl');
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


##[element.all().last()](https://github.com/angular/protractor/blob/master/lib/protractor.js#L199)
Get the last matching element for the locator.




###Example
```javascript
  element.all(by.css('li')).last()
```





###Returns

Type | Description
--- | ---
webdriver.WebElement | the last matching element


##[element.all().each()](https://github.com/angular/protractor/blob/master/lib/protractor.js#L223)
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





##[element.all().map()](https://github.com/angular/protractor/blob/master/lib/protractor.js#L242)
Apply a map function to each element found using the locator. The
callback receives the web element as the first argument and the index as
a second arg.




###Example
```javascript
  <ul class="menu">
    <li class="one">1</li>
    <li class="two">2</li>
  </ul>

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


##[Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js#L317)





###Params

Param | Type | Description
--- | --- | ---
webdriver | webdriver.WebDriver | null
opt_baseUrl | string | A base URL to run get requests against.





##[Protractor.prototype.waitForAngular](https://github.com/angular/protractor/blob/master/lib/protractor.js#L410)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[Protractor.prototype.wrapWebElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L451)





###Params

Param | Type | Description
--- | --- | ---
element | webdriver.WebElement | null




###Returns

Type | Description
--- | ---
webdriver.WebElement | the wrapped web element.


##[element.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L474)





###Params

Param | Type | Description
--- | --- | ---
selector | string | a css selector




###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L486)







###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[element.$$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L503)





###Params

Param | Type | Description
--- | --- | ---
selector | string | a css selector




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[element.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L516)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[elementFinder.find](https://github.com/angular/protractor/blob/master/lib/protractor.js#L102)







###Returns

Type | Description
--- | ---
webdriver.WebElement | 


##[element.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L540)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether an element could be located on the page.


##[element.evaluate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L556)





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


##[Protractor.prototype.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L575)







###Returns

Type | Description
--- | ---
!webdriver.WebElement | 


##[Protractor.prototype.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L593)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located {@link webdriver.WebElement}s.


##[Protractor.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L618)







###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to whether the element is present on the page.


##[Protractor.prototype.addMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L634)





###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to load or override.
script | (!string|Function) | The JavaScript to load the module.





##[Protractor.prototype.clearMockModules](https://github.com/angular/protractor/blob/master/lib/protractor.js#L648)








##[Protractor.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L656)





###Params

Param | Type | Description
--- | --- | ---
destination | string | Destination URL.





##[Protractor.prototype.getLocationAbsUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L723)








##[Protractor.prototype.debugger](https://github.com/angular/protractor/blob/master/lib/protractor.js#L731)








##[elementFinder.isPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L111)







###Returns

Type | Description
--- | ---
boolean | whether the element is present on the page.


##[exports.wrapDriver](https://github.com/angular/protractor/blob/master/lib/protractor.js#L794)





###Params

Param | Type | Description
--- | --- | ---
webdriver | webdriver.WebDriver | The configured webdriver instance.
opt_baseUrl | string | A URL to prepend to relative gets.




###Returns

Type | Description
--- | ---
Protractor | 


##[exports.setInstance](https://github.com/angular/protractor/blob/master/lib/protractor.js#L810)





###Params

Param | Type | Description
--- | --- | ---
ptor | Protractor | null





##[exports.getInstance](https://github.com/angular/protractor/blob/master/lib/protractor.js#L818)







###Returns

Type | Description
--- | ---
Protractor | 


##[exports.filterStackTrace](https://github.com/angular/protractor/blob/master/lib/protractor.js#L826)





###Params

Param | Type | Description
--- | --- | ---
text | string | Original stack trace.




###Returns

Type | Description
--- | ---
string | 


##[elementFinder.element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L118)
Calls to element may be chained to find elements within a parent.



###Example
```javascript
    var name = element(by.id('container')).element(by.model('name'));
    browser.get('myurl');
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


##[elementFinder.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L132)
Shortcut for chaining css element finders.



###Example
```javascript
    var name = element(by.id('container')).$('input.myclass');
    browser.get('myurl');
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


##[element.all](https://github.com/angular/protractor/blob/master/lib/protractor.js#L150)
element.all is used for operations on an array of elements (as opposed
to a single element).




###Example
```javascript
    var lis = element.all(by.css('li'));
    browser.get('myurl');
    expect(lis.count()).toEqual(4);
```



###Params

Param | Type | Description
--- | --- | ---
locator | webdriver.Locator | null




###Returns

Type | Description
--- | ---
ElementArrayFinder | 


##[elementArrayFinder.count](https://github.com/angular/protractor/blob/master/lib/protractor.js#L166)







###Returns

Type | Description
--- | ---
number | the number of elements matching the locator.


##[elementArrayFinder.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L175)





###Params

Param | Type | Description
--- | --- | ---
index | number | null




###Returns

Type | Description
--- | ---
webdriver.WebElement | the element at the given index


##[elementArrayFinder.first](https://github.com/angular/protractor/blob/master/lib/protractor.js#L186)







###Returns

Type | Description
--- | ---
webdriver.WebElement | the first matching element

