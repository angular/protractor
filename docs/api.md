Protractor API 1.1.1
==============

## Please note - this file is deprecated and replaced by searchable docs at [http://www.protractortest.org/#/api](http://www.protractortest.org/#/api)


##protractor

* [ElementArrayFinder](#api-elementarrayfinder)
* [ElementArrayFinder.prototype.locator](#api-elementarrayfinder-prototype-locator)
* [ElementArrayFinder.prototype.getWebElements](#api-elementarrayfinder-prototype-getwebelements)
* [ElementArrayFinder.prototype.get](#api-elementarrayfinder-prototype-get)
* [ElementArrayFinder.prototype.first](#api-elementarrayfinder-prototype-first)
* [ElementArrayFinder.prototype.last](#api-elementarrayfinder-prototype-last)
* [ElementArrayFinder.prototype.count](#api-elementarrayfinder-prototype-count)
* [ElementArrayFinder.prototype.each](#api-elementarrayfinder-prototype-each)
* [ElementArrayFinder.prototype.map](#api-elementarrayfinder-prototype-map)
* [ElementArrayFinder.prototype.filter](#api-elementarrayfinder-prototype-filter)
* [ElementArrayFinder.prototype.reduce](#api-elementarrayfinder-prototype-reduce)
* [ElementFinder](#api-elementfinder)
* [ElementFinder.prototype.element](#api-elementfinder-prototype-element)
* [ElementFinder.prototype.all](#api-elementfinder-prototype-all)
* [ElementFinder.prototype.$](#api-elementfinder-prototype-$)
* [ElementFinder.prototype.$$](#api-elementfinder-prototype-$$)
* [ElementFinder.prototype.isPresent](#api-elementfinder-prototype-ispresent)
* [ElementFinder.prototype.isElementPresent](#api-elementfinder-prototype-iselementpresent)
* [ElementFinder.prototype.locator](#api-elementfinder-prototype-locator)
* [ElementFinder.prototype.getWebElement](#api-elementfinder-prototype-getwebelement)
* [ElementFinder.prototype.evaluate](#api-elementfinder-prototype-evaluate)
* [ElementFinder.prototype.allowAnimations](#api-elementfinder-prototype-allowanimations)
* [ElementFinder.prototype.then](#api-elementfinder-prototype-then)
* [ElementFinder.prototype.isPending](#api-elementfinder-prototype-ispending)
* [Protractor](#api-protractor)
* [resetUrl](#api-reseturl)
* [Protractor.prototype.waitForAngular](#api-protractor-prototype-waitforangular)
* [Protractor.prototype.findElement](#api-protractor-prototype-findelement)
* [Protractor.prototype.findElements](#api-protractor-prototype-findelements)
* [Protractor.prototype.isElementPresent](#api-protractor-prototype-iselementpresent)
* [Protractor.prototype.addMockModule](#api-protractor-prototype-addmockmodule)
* [Protractor.prototype.clearMockModules](#api-protractor-prototype-clearmockmodules)
* [Protractor.prototype.removeMockModule](#api-protractor-prototype-removemockmodule)
* [Protractor.prototype.get](#api-protractor-prototype-get)
* [Protractor.prototype.refresh](#api-protractor-prototype-refresh)
* [Protractor.prototype.navigate](#api-protractor-prototype-navigate)
* [Protractor.prototype.setLocation](#api-protractor-prototype-setlocation)
* [Protractor.prototype.getLocationAbsUrl](#api-protractor-prototype-getlocationabsurl)
* [Protractor.prototype.debugger](#api-protractor-prototype-debugger)
* [Protractor.prototype.pause](#api-protractor-prototype-pause)

##locators

* [ProtractorBy](#api-protractorby)
* [WebdriverBy.prototype](#api-webdriverby-prototype)
* [ProtractorBy.prototype.addLocator](#api-protractorby-prototype-addlocator)
* [ProtractorBy.prototype.binding](#api-protractorby-prototype-binding)
* [ProtractorBy.prototype.exactBinding](#api-protractorby-prototype-exactbinding)
* [ProtractorBy.prototype.model](#api-protractorby-prototype-model)
* [ProtractorBy.prototype.buttonText](#api-protractorby-prototype-buttontext)
* [ProtractorBy.prototype.partialButtonText](#api-protractorby-prototype-partialbuttontext)
* [ProtractorBy.prototype.repeater](#api-protractorby-prototype-repeater)
* [ProtractorBy.prototype.cssContainingText](#api-protractorby-prototype-csscontainingtext)
* [ProtractorBy.prototype.options](#api-protractorby-prototype-options)

##webdriver

* [webdriver.WebDriver](#api-webdriver-webdriver)
* [webdriver.WebDriver.attachToSession](#api-webdriver-webdriver-attachtosession)
* [webdriver.WebDriver.createSession](#api-webdriver-webdriver-createsession)
* [webdriver.WebDriver.prototype.controlFlow](#api-webdriver-webdriver-prototype-controlflow)
* [webdriver.WebDriver.prototype.schedule](#api-webdriver-webdriver-prototype-schedule)
* [webdriver.WebDriver.prototype.getSession](#api-webdriver-webdriver-prototype-getsession)
* [webdriver.WebDriver.prototype.getCapabilities](#api-webdriver-webdriver-prototype-getcapabilities)
* [webdriver.WebDriver.prototype.quit](#api-webdriver-webdriver-prototype-quit)
* [webdriver.WebDriver.prototype.actions](#api-webdriver-webdriver-prototype-actions)
* [webdriver.WebDriver.prototype.executeScript](#api-webdriver-webdriver-prototype-executescript)
* [webdriver.WebDriver.prototype.executeAsyncScript](#api-webdriver-webdriver-prototype-executeasyncscript)
* [webdriver.WebDriver.prototype.call](#api-webdriver-webdriver-prototype-call)
* [webdriver.WebDriver.prototype.wait](#api-webdriver-webdriver-prototype-wait)
* [webdriver.WebDriver.prototype.sleep](#api-webdriver-webdriver-prototype-sleep)
* [webdriver.WebDriver.prototype.getWindowHandle](#api-webdriver-webdriver-prototype-getwindowhandle)
* [webdriver.WebDriver.prototype.getAllWindowHandles](#api-webdriver-webdriver-prototype-getallwindowhandles)
* [webdriver.WebDriver.prototype.getPageSource](#api-webdriver-webdriver-prototype-getpagesource)
* [webdriver.WebDriver.prototype.close](#api-webdriver-webdriver-prototype-close)
* [webdriver.WebDriver.prototype.get](#api-webdriver-webdriver-prototype-get)
* [webdriver.WebDriver.prototype.getCurrentUrl](#api-webdriver-webdriver-prototype-getcurrenturl)
* [webdriver.WebDriver.prototype.getTitle](#api-webdriver-webdriver-prototype-gettitle)
* [webdriver.WebDriver.prototype.findElement](#api-webdriver-webdriver-prototype-findelement)
* [webdriver.WebDriver.prototype.isElementPresent](#api-webdriver-webdriver-prototype-iselementpresent)
* [webdriver.WebDriver.prototype.findElements](#api-webdriver-webdriver-prototype-findelements)
* [webdriver.WebDriver.prototype.takeScreenshot](#api-webdriver-webdriver-prototype-takescreenshot)
* [webdriver.WebDriver.prototype.manage](#api-webdriver-webdriver-prototype-manage)
* [webdriver.WebDriver.prototype.navigate](#api-webdriver-webdriver-prototype-navigate)
* [webdriver.WebDriver.prototype.switchTo](#api-webdriver-webdriver-prototype-switchto)
* [webdriver.WebDriver.Navigation](#api-webdriver-webdriver-navigation)
* [webdriver.WebDriver.Navigation.prototype.to](#api-webdriver-webdriver-navigation-prototype-to)
* [webdriver.WebDriver.Navigation.prototype.back](#api-webdriver-webdriver-navigation-prototype-back)
* [webdriver.WebDriver.Navigation.prototype.forward](#api-webdriver-webdriver-navigation-prototype-forward)
* [webdriver.WebDriver.Navigation.prototype.refresh](#api-webdriver-webdriver-navigation-prototype-refresh)
* [webdriver.WebDriver.Options](#api-webdriver-webdriver-options)
* [webdriver.WebDriver.Options.prototype.addCookie](#api-webdriver-webdriver-options-prototype-addcookie)
* [webdriver.WebDriver.Options.prototype.deleteAllCookies](#api-webdriver-webdriver-options-prototype-deleteallcookies)
* [webdriver.WebDriver.Options.prototype.deleteCookie](#api-webdriver-webdriver-options-prototype-deletecookie)
* [webdriver.WebDriver.Options.prototype.getCookies](#api-webdriver-webdriver-options-prototype-getcookies)
* [webdriver.WebDriver.Options.prototype.getCookie](#api-webdriver-webdriver-options-prototype-getcookie)
* [webdriver.WebDriver.Options.prototype.logs](#api-webdriver-webdriver-options-prototype-logs)
* [webdriver.WebDriver.Options.prototype.timeouts](#api-webdriver-webdriver-options-prototype-timeouts)
* [webdriver.WebDriver.Options.prototype.window](#api-webdriver-webdriver-options-prototype-window)
* [webdriver.WebDriver.Timeouts](#api-webdriver-webdriver-timeouts)
* [webdriver.WebDriver.Timeouts.prototype.implicitlyWait](#api-webdriver-webdriver-timeouts-prototype-implicitlywait)
* [webdriver.WebDriver.Timeouts.prototype.setScriptTimeout](#api-webdriver-webdriver-timeouts-prototype-setscripttimeout)
* [webdriver.WebDriver.Timeouts.prototype.pageLoadTimeout](#api-webdriver-webdriver-timeouts-prototype-pageloadtimeout)
* [webdriver.WebDriver.Window](#api-webdriver-webdriver-window)
* [webdriver.WebDriver.Window.prototype.getPosition](#api-webdriver-webdriver-window-prototype-getposition)
* [webdriver.WebDriver.Window.prototype.setPosition](#api-webdriver-webdriver-window-prototype-setposition)
* [webdriver.WebDriver.Window.prototype.getSize](#api-webdriver-webdriver-window-prototype-getsize)
* [webdriver.WebDriver.Window.prototype.setSize](#api-webdriver-webdriver-window-prototype-setsize)
* [webdriver.WebDriver.Window.prototype.maximize](#api-webdriver-webdriver-window-prototype-maximize)
* [webdriver.WebDriver.Logs](#api-webdriver-webdriver-logs)
* [webdriver.WebDriver.Logs.prototype.get](#api-webdriver-webdriver-logs-prototype-get)
* [webdriver.WebDriver.Logs.prototype.getAvailableLogTypes](#api-webdriver-webdriver-logs-prototype-getavailablelogtypes)
* [webdriver.WebDriver.TargetLocator](#api-webdriver-webdriver-targetlocator)
* [webdriver.WebDriver.TargetLocator.prototype.activeElement](#api-webdriver-webdriver-targetlocator-prototype-activeelement)
* [webdriver.WebDriver.TargetLocator.prototype.defaultContent](#api-webdriver-webdriver-targetlocator-prototype-defaultcontent)
* [webdriver.WebDriver.TargetLocator.prototype.frame](#api-webdriver-webdriver-targetlocator-prototype-frame)
* [webdriver.WebDriver.TargetLocator.prototype.window](#api-webdriver-webdriver-targetlocator-prototype-window)
* [webdriver.WebDriver.TargetLocator.prototype.alert](#api-webdriver-webdriver-targetlocator-prototype-alert)
* [webdriver.Key.chord](#api-webdriver-key-chord)
* [webdriver.WebElement](#api-webdriver-webelement)
* [webdriver.WebElement.equals](#api-webdriver-webelement-equals)
* [webdriver.WebElement.prototype.getDriver](#api-webdriver-webelement-prototype-getdriver)
* [webdriver.WebElement.prototype.toWireValue](#api-webdriver-webelement-prototype-towirevalue)
* [webdriver.WebElement.prototype.findElement](#api-webdriver-webelement-prototype-findelement)
* [webdriver.WebElement.prototype.isElementPresent](#api-webdriver-webelement-prototype-iselementpresent)
* [webdriver.WebElement.prototype.findElements](#api-webdriver-webelement-prototype-findelements)
* [webdriver.WebElement.prototype.click](#api-webdriver-webelement-prototype-click)
* [webdriver.WebElement.prototype.sendKeys](#api-webdriver-webelement-prototype-sendkeys)
* [webdriver.WebElement.prototype.getTagName](#api-webdriver-webelement-prototype-gettagname)
* [webdriver.WebElement.prototype.getCssValue](#api-webdriver-webelement-prototype-getcssvalue)
* [webdriver.WebElement.prototype.getAttribute](#api-webdriver-webelement-prototype-getattribute)
* [webdriver.WebElement.prototype.getText](#api-webdriver-webelement-prototype-gettext)
* [webdriver.WebElement.prototype.getSize](#api-webdriver-webelement-prototype-getsize)
* [webdriver.WebElement.prototype.getLocation](#api-webdriver-webelement-prototype-getlocation)
* [webdriver.WebElement.prototype.isEnabled](#api-webdriver-webelement-prototype-isenabled)
* [webdriver.WebElement.prototype.isSelected](#api-webdriver-webelement-prototype-isselected)
* [webdriver.WebElement.prototype.submit](#api-webdriver-webelement-prototype-submit)
* [webdriver.WebElement.prototype.clear](#api-webdriver-webelement-prototype-clear)
* [webdriver.WebElement.prototype.isDisplayed](#api-webdriver-webelement-prototype-isdisplayed)
* [webdriver.WebElement.prototype.getOuterHtml](#api-webdriver-webelement-prototype-getouterhtml)
* [webdriver.WebElement.prototype.getInnerHtml](#api-webdriver-webelement-prototype-getinnerhtml)
* [webdriver.Alert](#api-webdriver-alert)
* [webdriver.Alert.prototype.getText](#api-webdriver-alert-prototype-gettext)
* [webdriver.Alert.prototype.accept](#api-webdriver-alert-prototype-accept)
* [webdriver.Alert.prototype.dismiss](#api-webdriver-alert-prototype-dismiss)
* [webdriver.Alert.prototype.sendKeys](#api-webdriver-alert-prototype-sendkeys)
* [webdriver.UnhandledAlertError](#api-webdriver-unhandledalerterror)
* [webdriver.UnhandledAlertError.prototype.getAlert](#api-webdriver-unhandledalerterror-prototype-getalert)

##<a name="api-elementarrayfinder"></a>[ElementArrayFinder](https://github.com/angular/protractor/blob/master/lib/protractor.js#L69)
#### Use as: element.all(locator)
ElementArrayFinder is used for operations on an array of elements (as opposed
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
locator | webdriver.Locator | An element locator.
opt_parentElementFinder | [ElementFinder](#elementfinder)= | The element finder previous to   this. (i.e. opt_parentElementFinder.all(locator) => this)




###Returns

Type | Description
--- | ---
[ElementArrayFinder](#elementarrayfinder) | 


##<a name="api-elementarrayfinder-prototype-locator"></a>[ElementArrayFinder.prototype.locator](https://github.com/angular/protractor/blob/master/lib/protractor.js#L101)








###Returns

Type | Description
--- | ---
webdriver.Locator | 


##<a name="api-elementarrayfinder-prototype-getwebelements"></a>[ElementArrayFinder.prototype.getWebElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L108)
#### Use as: element.all(locator).getWebElements()
Returns the array of WebElements represented by this ElementArrayFinder. 






###Returns

Type | Description
--- | ---
Array.&lt;webdriver.WebElement&gt; | 


##<a name="api-elementarrayfinder-prototype-get"></a>[ElementArrayFinder.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L134)
#### Use as: element.all(locator).get(index)
Get an element found by the locator by index. The index starts at 0. 
This does not actually retrieve the underlying element.


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
[ElementFinder](#elementfinder) | finder representing element at the given index.


##<a name="api-elementarrayfinder-prototype-first"></a>[ElementArrayFinder.prototype.first](https://github.com/angular/protractor/blob/master/lib/protractor.js#L158)
#### Use as: element.all(locator).first()
Get the first matching element for the locator. This does not actually 
retrieve the underlying element.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
var first = element.all(by.css('.items li')).first();
expect(first.getText()).toBe('First');
```





###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | finder representing the first matching element


##<a name="api-elementarrayfinder-prototype-last"></a>[ElementArrayFinder.prototype.last](https://github.com/angular/protractor/blob/master/lib/protractor.js#L180)
#### Use as: element.all(locator).last()
Get the last matching element for the locator. This does not actually 
retrieve the underlying element.


###Example

```html
<ul class="items">
  <li>First</li>
  <li>Second</li>
  <li>Third</li>
</ul>
```

```javascript
var last = element.all(by.css('.items li')).last();
expect(last.getText()).toBe('Third');
```





###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | finder representing the last matching element


##<a name="api-elementarrayfinder-prototype-count"></a>[ElementArrayFinder.prototype.count](https://github.com/angular/protractor/blob/master/lib/protractor.js#L202)
#### Use as: element.all(locator).count()
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


##<a name="api-elementarrayfinder-prototype-each"></a>[ElementArrayFinder.prototype.each](https://github.com/angular/protractor/blob/master/lib/protractor.js#L269)
#### Use as: element.all(locator).each(eachFunction)
Calls the input function on each ElementFinder found by the locator.


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
fn | function([ElementFinder](#elementfinder)) | Input function





##<a name="api-elementarrayfinder-prototype-map"></a>[ElementArrayFinder.prototype.map](https://github.com/angular/protractor/blob/master/lib/protractor.js#L296)
#### Use as: element.all(locator).map(mapFunction)
Apply a map function to each element found using the locator. The
callback receives the ElementFinder as the first argument and the index as
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
mapFn | function([ElementFinder](#elementfinder), number) | Map function that will be applied to each element.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to an array of values returned by the map function.


##<a name="api-elementarrayfinder-prototype-filter"></a>[ElementArrayFinder.prototype.filter](https://github.com/angular/protractor/blob/master/lib/protractor.js#L342)
#### Use as: element.all(locator).filter(filterFn)
Apply a filter function to each element found using the locator. Returns 
promise of a new array with all elements that pass the filter function. The
filter function receives the ElementFinder as the first argument 
and the index as a second arg.


###Example

```html
<ul class="items">
  <li class="one">First</li>
  <li class="two">Second</li>
  <li class="three">Third</li>
</ul>
```

```javascript
element.all(by.css('.items li')).filter(function(elem, index) {
  return elem.getText().then(function(text) {
    return text === 'Third';
  });
}).then(function(filteredElements) {
  filteredElements[0].click();
});
```



###Params

Param | Type | Description
--- | --- | ---
filterFn | function([ElementFinder](#elementfinder), number): webdriver.WebElement.Promise | Filter function that will test if an element should be returned. filterFn should return a promise that resolves to a boolean.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to an array of ElementFinders that satisfy the filter function.


##<a name="api-elementarrayfinder-prototype-reduce"></a>[ElementArrayFinder.prototype.reduce](https://github.com/angular/protractor/blob/master/lib/protractor.js#L385)
#### Use as: element.all(locator).reduce(reduceFn)
Apply a reduce function against an accumulator and every element found 
using the locator (from left-to-right). The reduce function has to reduce
every element into a single value (the accumulator). Returns promise of 
the accumulator. The reduce function receives the accumulator, current 
ElementFinder, the index, and the entire array of ElementFinders, 
respectively.


###Example

```html
<ul class="items">
  <li class="one">First</li>
  <li class="two">Second</li>
  <li class="three">Third</li>
</ul>
```

```javascript
var value = element.all(by.css('.items li')).reduce(function(acc, elem) {
  return elem.getText().then(function(text) {
    return acc + text + ' ';
  });
});

expect(value).toEqual('First Second Third ');
```



###Params

Param | Type | Description
--- | --- | ---
reduceFn | function(number, [ElementFinder](#elementfinder), number, Array.&lt;ElementFinder&gt;) | Reduce function that reduces every element into a single value.
initialValue | * | Initial value of the accumulator.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to the final value of the accumulator.


##<a name="api-elementfinder"></a>[ElementFinder](https://github.com/angular/protractor/blob/master/lib/protractor.js#L428)
#### Use as: element(locator)
The ElementFinder can be treated as a WebElement for most purposes, in 
particular, you may perform actions (i.e. click, getText) on them as you
would a WebElement. ElementFinders extend Promise, and once an action 
is performed on an ElementFinder, the latest result from the chain can be 
accessed using then. Unlike a WebElement, an ElementFinder will wait for
angular to settle before performing finds or actions.

ElementFinder can be used to build a chain of locators that is used to find
an element. An ElementFinder does not actually attempt to find the element 
until an action is called, which means they can be set up in helper files 
before the page is available. 


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
opt_parentElementFinder | [ElementFinder](#elementfinder)= | The element finder previous  to this. (i.e. opt_parentElementFinder.element(locator) => this)
opt_actionResult | webdriver.promise.Promise | The promise which  will be retrieved with then. Resolves to the latest action result,  or null if no action has been called.
opt_index | number= | The index of the element to retrieve. null means retrieve the only element, while -1 means retrieve the last element




###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | 


##<a name="api-elementfinder-prototype-element"></a>[ElementFinder.prototype.element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L505)
#### Use as: element(locator).element(locator)
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
subLocator | webdriver.Locator | 




###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | 


##<a name="api-elementfinder-prototype-all"></a>[ElementFinder.prototype.all](https://github.com/angular/protractor/blob/master/lib/protractor.js#L536)
#### Use as: element(locator).all(locator)
Calls to element may be chained to find an array of elements within a parent.


###Example

```html
<div class="parent">
  <ul>
    <li class="one">First</li>
    <li class="two">Second</li>
    <li class="three">Third</li>
  </ul>
</div>
```

```javascript
var items = element(by.css('.parent')).all(by.tagName('li'))
```



###Params

Param | Type | Description
--- | --- | ---
subLocator | webdriver.Locator | 




###Returns

Type | Description
--- | ---
[ElementArrayFinder](#elementarrayfinder) | 


##<a name="api-elementfinder-prototype-$"></a>[ElementFinder.prototype.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L559)
#### Use as: $(cssSelector)
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
[ElementFinder](#elementfinder) | which identifies the located  [webdriver.WebElement](#webdriverwebelement)


##<a name="api-elementfinder-prototype-$$"></a>[ElementFinder.prototype.$$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L581)
#### Use as: $$(cssSelector)
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
[ElementArrayFinder](#elementarrayfinder) | which identifies the array of the located [webdriver.WebElement](#webdriverwebelement)s.


##<a name="api-elementfinder-prototype-ispresent"></a>[ElementFinder.prototype.isPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L609)
#### Use as: element(locator).isPresent()
Determine whether the element is present on the page.


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
[ElementFinder](#elementfinder) | which resolves to whether the element is present on the page.


##<a name="api-elementfinder-prototype-iselementpresent"></a>[ElementFinder.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L636)

Override for WebElement.prototype.isElementPresent so that protractor waits
for Angular to settle before making the check.






###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | which resolves to whether the element is present on the page.


##<a name="api-elementfinder-prototype-locator"></a>[ElementFinder.prototype.locator](https://github.com/angular/protractor/blob/master/lib/protractor.js#L648)








###Returns

Type | Description
--- | ---
webdriver.Locator | 


##<a name="api-elementfinder-prototype-getwebelement"></a>[ElementFinder.prototype.getWebElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L655)
#### Use as: element(locator).getWebElement()
Returns the WebElement represented by this ElementFinder. 
Throws the WebDriver error if the element doesn't exist.
If index is null, it makes sure that there is only one underlying
WebElement described by the chain of locators and issues a warning 
otherwise. If index is not null, it retrieves the WebElement specified by 
the index.


###Example

```javascript
The following three expressions are equivalent.
 - element(by.css('.parent')).getWebElement();
 - browser.waitForAngular(); browser.driver.findElement(by.css('.parent'));
 - browser.findElement(by.css('.parent'))
```





###Returns

Type | Description
--- | ---
[webdriver.WebElement](#webdriverwebelement) | 


##<a name="api-elementfinder-prototype-evaluate"></a>[ElementFinder.prototype.evaluate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L709)

Evaluates the input as if it were on the scope of the current element.




###Params

Param | Type | Description
--- | --- | ---
expression | string | 




###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | which resolves to the evaluated expression. The result will be resolved as in {@link webdriver.WebDriver.executeScript}. In summary - primitives will be resolved as is, functions will be converted to string, and elements will be returned as a WebElement.


##<a name="api-elementfinder-prototype-allowanimations"></a>[ElementFinder.prototype.allowAnimations](https://github.com/angular/protractor/blob/master/lib/protractor.js#L727)

Determine if animation is allowed on the current element.




###Params

Param | Type | Description
--- | --- | ---
value | string | 




###Returns

Type | Description
--- | ---
[ElementFinder](#elementfinder) | which resolves to whether animation is allowed.


##<a name="api-elementfinder-prototype-then"></a>[ElementFinder.prototype.then](https://github.com/angular/protractor/blob/master/lib/protractor.js#L741)

Access the underlying actionResult of ElementFinder. Implementation allows
ElementFinder to be used as a webdriver.promise.Promise




###Params

Param | Type | Description
--- | --- | ---
fn | function(webdriver.promise.Promise) | Function which takes  the value of the underlying actionResult.




###Returns

Type | Description
--- | ---
webdriver.promise.Promise | Promise which contains the results of  evaluating fn.


##<a name="api-elementfinder-prototype-ispending"></a>[ElementFinder.prototype.isPending](https://github.com/angular/protractor/blob/master/lib/protractor.js#L758)

Webdriver rely on this function to be present on Promises, so adding
this dummy function as we inherited from webdriver.promise.Promise, but
this function is irrelevant to our usage






###Returns

Type | Description
--- | ---
boolean | Always false as ElementFinder is never in pending state.


##<a name="api-protractor"></a>[Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js#L780)






###Params

Param | Type | Description
--- | --- | ---
webdriver | [webdriver.WebDriver](#webdriverwebdriver) | 
opt_baseUrl | string= | A base URL to run get requests against.
opt_rootElement | string= | Selector element that has an ng-app in scope.





##<a name="api-reseturl"></a>[resetUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L880)

The reset URL to use between page loads.







##<a name="api-protractor-prototype-waitforangular"></a>[Protractor.prototype.waitForAngular](https://github.com/angular/protractor/blob/master/lib/protractor.js#L894)

Instruct webdriver to wait until Angular has finished rendering and has
no outstanding $http calls before continuing.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##<a name="api-protractor-prototype-findelement"></a>[Protractor.prototype.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L933)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | 


##<a name="api-protractor-prototype-findelements"></a>[Protractor.prototype.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L942)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located [webdriver.WebElement](#webdriverwebelement)s.


##<a name="api-protractor-prototype-iselementpresent"></a>[Protractor.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L952)

Tests if an element is present on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to whether the element is present on the page.


##<a name="api-protractor-prototype-addmockmodule"></a>[Protractor.prototype.addMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L964)

Add a module to load before Angular whenever Protractor.get is called.
Modules will be registered after existing modules already on the page,
so any module registered here will override preexisting modules with the same
name.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to load or override.
script | !string&#124;Function | The JavaScript to load the module.
varArgs | ...* | Any additional arguments will be provided to the script and may be referenced using the `arguments` object.





##<a name="api-protractor-prototype-clearmockmodules"></a>[Protractor.prototype.clearMockModules](https://github.com/angular/protractor/blob/master/lib/protractor.js#L985)

Clear the list of registered mock modules.







##<a name="api-protractor-prototype-removemockmodule"></a>[Protractor.prototype.removeMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L992)

Remove a registered mock module.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to remove.





##<a name="api-protractor-prototype-get"></a>[Protractor.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1004)

See webdriver.WebDriver.get

Navigate to the given destination and loads mock modules before
Angular. Assumes that the page being loaded uses Angular.
If you need to access a page which does not have Angular on load, use
the wrapped webdriver directly.




###Params

Param | Type | Description
--- | --- | ---
destination | string | Destination URL.
opt_timeout | number= | Number of milliseconds to wait for Angular to start.





##<a name="api-protractor-prototype-refresh"></a>[Protractor.prototype.refresh](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1086)

See webdriver.WebDriver.refresh

Makes a full reload of the current page and loads mock modules before
Angular. Assumes that the page being loaded uses Angular.
If you need to access a page which does not have Angular on load, use
the wrapped webdriver directly.




###Params

Param | Type | Description
--- | --- | ---
opt_timeout | number= | Number of seconds to wait for Angular to start.





##<a name="api-protractor-prototype-navigate"></a>[Protractor.prototype.navigate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1109)

Mixin navigation methods back into the navigation object so that
they are invoked as before, i.e. driver.navigate().refresh()







##<a name="api-protractor-prototype-setlocation"></a>[Protractor.prototype.setLocation](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1119)

Browse to another page using in-page navigation.




###Params

Param | Type | Description
--- | --- | ---
url | string | In page URL using the same syntax as $location.url()




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve once page has been changed.


##<a name="api-protractor-prototype-getlocationabsurl"></a>[Protractor.prototype.getLocationAbsUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1137)

Returns the current absolute url from AngularJS.







##<a name="api-protractor-prototype-debugger"></a>[Protractor.prototype.debugger](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1145)

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







##<a name="api-protractor-prototype-pause"></a>[Protractor.prototype.pause](https://github.com/angular/protractor/blob/master/lib/protractor.js#L1170)

Beta (unstable) pause function for debugging webdriver tests. Use
browser.pause() in your test to enter the protractor debugger from that
point in the control flow.
Does not require changes to the command line (no need to add 'debug').







##<a name="api-protractorby"></a>[ProtractorBy](https://github.com/angular/protractor/blob/master/lib/locators.js#L6)

The Protractor Locators. These provide ways of finding elements in
Angular applications by binding, model, etc.







##<a name="api-webdriverby-prototype"></a>[WebdriverBy.prototype](https://github.com/angular/protractor/blob/master/lib/locators.js#L15)

webdriver's By is an enum of locator functions, so we must set it to
a prototype before inheriting from it.







##<a name="api-protractorby-prototype-addlocator"></a>[ProtractorBy.prototype.addLocator](https://github.com/angular/protractor/blob/master/lib/locators.js#L22)
#### Use as: by.addLocator(locatorName, functionOrScript)
Add a locator to this instance of ProtractorBy. This locator can then be
used with element(by.locatorName(args)).


###Example

```html
<button ng-click="doAddition()">Go!</button>
```

```javascript
// Add the custom locator.
by.addLocator('buttonTextSimple', function(buttonText, opt_parentElement) {
  // This function will be serialized as a string and will execute in the
  // browser. The first argument is the text for the button. The second
  // argument is the parent element, if any.
  var using = opt_parentElement || document,
  buttons = using.querySelectorAll('button');

  // Return an array of buttons with the text.
  return Array.prototype.filter.call(buttons, function(button) {
    return button.textContent === buttonText;
  });
});

// Use the custom locator.
element(by.buttonTextSimple('Go!')).click();
```



###Params

Param | Type | Description
--- | --- | ---
name | string | The name of the new locator.
script | Function&#124;string | A script to be run in the context of the browser. This script will be passed an array of arguments that contains any args passed into the locator followed by the element scoping the search. It should return an array of elements.





##<a name="api-protractorby-prototype-binding"></a>[ProtractorBy.prototype.binding](https://github.com/angular/protractor/blob/master/lib/locators.js#L76)
#### Use as: by.binding()
Find an element by binding.


###Example

```html
<span>{{person.name}}</span>
<span ng-bind="person.email"></span>
```

```javascript
var span1 = element(by.binding('person.name'));
expect(span1.getText()).toBe('Foo');

var span2 = element(by.binding('person.email'));
expect(span2.getText()).toBe('foo@bar.com');
```



###Params

Param | Type | Description
--- | --- | ---
bindingDescriptor | string | 




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, toString: Function&#124;string} | 


##<a name="api-protractorby-prototype-exactbinding"></a>[ProtractorBy.prototype.exactBinding](https://github.com/angular/protractor/blob/master/lib/locators.js#L107)
#### Use as: by.exactBinding()
Find an element by exact binding.


###Example

```html
<span>{{ person.name }}</span>
<span ng-bind="person-email"></span>
<span>{{person_phone|uppercase}}</span>
```

```javascript
expect(element(by.exactBinding('person.name')).isPresent()).toBe(true);
expect(element(by.exactBinding('person-email')).isPresent()).toBe(true);
expect(element(by.exactBinding('person')).isPresent()).toBe(false);
expect(element(by.exactBinding('person_phone')).isPresent()).toBe(true);
expect(element(by.exactBinding('person_phone|uppercase')).isPresent()).toBe(true);
expect(element(by.exactBinding('phone')).isPresent()).toBe(false);
```



###Params

Param | Type | Description
--- | --- | ---
bindingDescriptor | string | 




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, toString: Function&#124;string} | 


##<a name="api-protractorby-prototype-model"></a>[ProtractorBy.prototype.model](https://github.com/angular/protractor/blob/master/lib/locators.js#L140)
#### Use as: by.model(modelName)
Find an element by ng-model expression.


###Example

```html
<input type="text" ng-model="person.name"/>
```

```javascript
var input = element(by.model('person.name'));
input.sendKeys('123');
expect(input.getAttribute('value')).toBe('Foo123');
```



###Params

Param | Type | Description
--- | --- | ---
model | string | ng-model expression.





##<a name="api-protractorby-prototype-buttontext"></a>[ProtractorBy.prototype.buttonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L166)

Find a button by text.


###Example

```html
<button>Save</button>
```

```javascript
element(by.buttonText('Save'));
```



###Params

Param | Type | Description
--- | --- | ---
searchText | string | 




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, toString: Function&#124;string} | 


##<a name="api-protractorby-prototype-partialbuttontext"></a>[ProtractorBy.prototype.partialButtonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L191)

Find a button by partial text.


###Example

```html
<button>Save my file</button>
```

```javascript
element(by.partialButtonText('Save'));
```



###Params

Param | Type | Description
--- | --- | ---
searchText | string | 




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, toString: Function&#124;string} | 


##<a name="api-protractorby-prototype-repeater"></a>[ProtractorBy.prototype.repeater](https://github.com/angular/protractor/blob/master/lib/locators.js#L217)

Find elements inside an ng-repeat.


###Example

```html
<div ng-repeat="cat in pets">
  <span>{{cat.name}}</span>
  <span>{{cat.age}}</span>
</div>

<div class="book-img" ng-repeat-start="book in library">
  <span>{{$index}}</span>
</div>
<div class="book-info" ng-repeat-end>
  <h4>{{book.name}}</h4>
  <p>{{book.blurb}}</p>
</div>
```

```javascript
// Returns the DIV for the second cat.
var secondCat = element(by.repeater('cat in pets').row(1));

// Returns the SPAN for the first cat's name.
var firstCatName = element(by.repeater('cat in pets').
    row(0).column('{{cat.name}}'));

// Returns a promise that resolves to an array of WebElements from a column
var ages = element.all(
    by.repeater('cat in pets').column('{{cat.age}}'));

// Returns a promise that resolves to an array of WebElements containing
// all top level elements repeated by the repeater. For 2 pets rows resolves
// to an array of 2 elements.
var rows = element.all(by.repeater('cat in pets'));

// Returns a promise that resolves to an array of WebElements containing all
// the elements with a binding to the book's name.
var divs = element.all(by.repeater('book in library').column('book.name'));

// Returns a promise that resolves to an array of WebElements containing
// the DIVs for the second book.
var bookInfo = element.all(by.repeater('book in library').row(1));

// Returns the H4 for the first book's name.
var firstBookName = element(by.repeater('book in library').
    row(0).column('{{book.name}}'));

// Returns a promise that resolves to an array of WebElements containing
// all top level elements repeated by the repeater. For 2 books divs
// resolves to an array of 4 elements.
var divs = element.all(by.repeater('book in library'));
```






##<a name="api-protractorby-prototype-csscontainingtext"></a>[ProtractorBy.prototype.cssContainingText](https://github.com/angular/protractor/blob/master/lib/locators.js#L332)

Find elements by CSS which contain a certain string.


###Example

```html
<ul>
  <li class="pet">Dog</li>
  <li class="pet">Cat</li>
</ul>
```

```javascript
// Returns the DIV for the dog, but not cat.
var dog = element(by.cssContainingText('.pet', 'Dog'));
```






##<a name="api-protractorby-prototype-options"></a>[ProtractorBy.prototype.options](https://github.com/angular/protractor/blob/master/lib/locators.js#L358)
#### Use as: by.options(optionsDescriptor)
Find an element by ng-options expression.


###Example

```html
<select ng-model="color" ng-options="c for c in colors">
  <option value="0" selected="selected">red</option>
  <option value="1">green</option>
</select>
```

```javascript
var allOptions = element.all(by.options('c for c in colors'));
expect(allOptions.count()).toEqual(2);
var firstOption = allOptions.first();
expect(firstOption.getText()).toEqual('red');
```



###Params

Param | Type | Description
--- | --- | ---
optionsDescriptor | string | ng-options expression.





##<a name="api-webdriver-webdriver"></a>[webdriver.WebDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#47)

Creates a new WebDriver client, which provides control over a browser.

Every WebDriver command returns a {@code webdriver.promise.Promise} that
represents the result of that command. Callbacks may be registered on this
object to manipulate the command result or catch an expected error. Any
commands scheduled with a callback are considered sub-commands and will
execute before the next command in the current frame. For example:
<pre><code>
  var message = [];
  driver.call(message.push, message, 'a').then(function() {
    driver.call(message.push, message, 'b');
  });
  driver.call(message.push, message, 'c');
  driver.call(function() {
    alert('message is abc? ' + (message.join('') == 'abc'));
  });
</code></pre>




###Params

Param | Type | Description
--- | --- | ---
session | !(webdriver.Session&#124;webdriver.promise.Promise) | Either a known session or a promise that will be resolved to a session.
executor | !webdriver.CommandExecutor | The executor to use when sending commands to the browser.
opt_flow | webdriver.promise.ControlFlow= | The flow to schedule commands through. Defaults to the active flow object.





##<a name="api-webdriver-webdriver-attachtosession"></a>[webdriver.WebDriver.attachToSession](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#87)

Creates a new WebDriver client for an existing session.




###Params

Param | Type | Description
--- | --- | ---
executor | !webdriver.CommandExecutor | Command executor to use when querying for session details.
sessionId | string | ID of the session to attach to.




###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver](#webdriverwebdriver) | A new client for the specified session.


##<a name="api-webdriver-webdriver-createsession"></a>[webdriver.WebDriver.createSession](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#102)

Creates a new WebDriver session.




###Params

Param | Type | Description
--- | --- | ---
executor | !webdriver.CommandExecutor | The executor to create the new session with.
desiredCapabilities | !webdriver.Capabilities | The desired capabilities for the new session.




###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver](#webdriverwebdriver) | The driver for the newly created session.


##<a name="api-webdriver-webdriver-prototype-controlflow"></a>[webdriver.WebDriver.prototype.controlFlow](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#243)








###Returns

Type | Description
--- | ---
!webdriver.promise.ControlFlow | The control flow used by this instance.


##<a name="api-webdriver-webdriver-prototype-schedule"></a>[webdriver.WebDriver.prototype.schedule](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#252)

Schedules a {@code webdriver.Command} to be executed by this driver's
{@code webdriver.CommandExecutor}.




###Params

Param | Type | Description
--- | --- | ---
command | !webdriver.Command | The command to schedule.
description | string | A description of the command for debugging.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;T&gt; | A promise that will be resolved with the command result.


##<a name="api-webdriver-webdriver-prototype-getsession"></a>[webdriver.WebDriver.prototype.getSession](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#305)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!webdriver.Session&gt; | A promise for this client's session.


##<a name="api-webdriver-webdriver-prototype-getcapabilities"></a>[webdriver.WebDriver.prototype.getCapabilities](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#314)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!webdriver.Capabilities&gt; | A promise that will resolve with the this instance's capabilities.


##<a name="api-webdriver-webdriver-prototype-quit"></a>[webdriver.WebDriver.prototype.quit](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#325)

Schedules a command to quit the current session. After calling quit, this
instance will be invalidated and may no longer be used to issue commands
against the browser.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the command has completed.


##<a name="api-webdriver-webdriver-prototype-actions"></a>[webdriver.WebDriver.prototype.actions](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#344)

Creates a new action sequence using this driver. The sequence will not be
scheduled for execution until {@link webdriver.ActionSequence#perform} is
called. Example:
<pre><code>
  driver.actions().
      mouseDown(element1).
      mouseMove(element2).
      mouseUp().
      perform();
</code></pre>






###Returns

Type | Description
--- | ---
!webdriver.ActionSequence | A new action sequence for this instance.


##<a name="api-webdriver-webdriver-prototype-executescript"></a>[webdriver.WebDriver.prototype.executeScript](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#362)

Schedules a command to execute JavaScript in the context of the currently
selected frame or window. The script fragment will be executed as the body
of an anonymous function. If the script is provided as a function object,
that function will be converted to a string for injection into the target
window.

Any arguments provided in addition to the script will be included as script
arguments and may be referenced using the {@code arguments} object.
Arguments may be a boolean, number, string, or {@code webdriver.WebElement}.
Arrays and objects may also be used as script arguments as long as each item
adheres to the types previously mentioned.

The script may refer to any variables accessible from the current window.
Furthermore, the script will execute in the window's context, thus
{@code document} may be used to refer to the current document. Any local
variables will not be available once the script has finished executing,
though global variables will persist.

If the script has a return value (i.e. if the script contains a return
statement), then the following steps will be taken for resolving this
functions return value:
<ul>
<li>For a HTML element, the value will resolve to a
    {@code webdriver.WebElement}</li>
<li>Null and undefined return values will resolve to null</li>
<li>Booleans, numbers, and strings will resolve as is</li>
<li>Functions will resolve to their string representation</li>
<li>For arrays and objects, each member item will be converted according to
    the rules above</li>
</ul>




###Params

Param | Type | Description
--- | --- | ---
script | !(string&#124;Function) | The script to execute.
var_args | ...* | The arguments to pass to the script.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;T&gt; | A promise that will resolve to the scripts return value.


##<a name="api-webdriver-webdriver-prototype-executeasyncscript"></a>[webdriver.WebDriver.prototype.executeAsyncScript](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#412)

Schedules a command to execute asynchronous JavaScript in the context of the
currently selected frame or window. The script fragment will be executed as
the body of an anonymous function. If the script is provided as a function
object, that function will be converted to a string for injection into the
target window.

Any arguments provided in addition to the script will be included as script
arguments and may be referenced using the {@code arguments} object.
Arguments may be a boolean, number, string, or {@code webdriver.WebElement}.
Arrays and objects may also be used as script arguments as long as each item
adheres to the types previously mentioned.

Unlike executing synchronous JavaScript with
{@code webdriver.WebDriver.prototype.executeScript}, scripts executed with
this function must explicitly signal they are finished by invoking the
provided callback. This callback will always be injected into the
executed function as the last argument, and thus may be referenced with
{@code arguments[arguments.length - 1]}. The following steps will be taken
for resolving this functions return value against the first argument to the
script's callback function:
<ul>
<li>For a HTML element, the value will resolve to a
    {@code webdriver.WebElement}</li>
<li>Null and undefined return values will resolve to null</li>
<li>Booleans, numbers, and strings will resolve as is</li>
<li>Functions will resolve to their string representation</li>
<li>For arrays and objects, each member item will be converted according to
    the rules above</li>
</ul>

Example #1: Performing a sleep that is synchronized with the currently
selected window:
<code><pre>
var start = new Date().getTime();
driver.executeAsyncScript(
    'window.setTimeout(arguments[arguments.length - 1], 500);').
    then(function() {
      console.log('Elapsed time: ' + (new Date().getTime() - start) + ' ms');
    });
</pre></code>

Example #2: Synchronizing a test with an AJAX application:
<code><pre>
var button = driver.findElement(By.id('compose-button'));
button.click();
driver.executeAsyncScript(
    'var callback = arguments[arguments.length - 1];' +
    'mailClient.getComposeWindowWidget().onload(callback);');
driver.switchTo().frame('composeWidget');
driver.findElement(By.id('to')).sendKEys('dog@example.com');
</pre></code>

Example #3: Injecting a XMLHttpRequest and waiting for the result. In this
example, the inject script is specified with a function literal. When using
this format, the function is converted to a string for injection, so it
should not reference any symbols not defined in the scope of the page under
test.
<code><pre>
driver.executeAsyncScript(function() {
  var callback = arguments[arguments.length - 1];
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/resource/data.json", true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      callback(xhr.resposneText);
    }
  }
  xhr.send('');
}).then(function(str) {
  console.log(JSON.parse(str)['food']);
});
</pre></code>




###Params

Param | Type | Description
--- | --- | ---
script | !(string&#124;Function) | The script to execute.
var_args | ...* | The arguments to pass to the script.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;T&gt; | A promise that will resolve to the scripts return value.


##<a name="api-webdriver-webdriver-prototype-call"></a>[webdriver.WebDriver.prototype.call](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#504)

Schedules a command to execute a custom function.




###Params

Param | Type | Description
--- | --- | ---
fn | function(...): (T&#124;webdriver.promise.Promise.&lt;T&gt;) | The function to execute.
opt_scope | Object= | The object in whose scope to execute the function.
var_args | ...* | Any arguments to pass to the function.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;T&gt; | A promise that will be resolved' with the function's result.


##<a name="api-webdriver-webdriver-prototype-wait"></a>[webdriver.WebDriver.prototype.wait](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#525)

Schedules a command to wait for a condition to hold, as defined by some
user supplied function. If any errors occur while evaluating the wait, they
will be allowed to propagate.

<p>In the event a condition returns a {@link webdriver.promise.Promise}, the 
polling loop will wait for it to be resolved and use the resolved value for 
evaluating whether the condition has been satisfied. The resolution time for
a promise is factored into whether a wait has timed out.




###Params

Param | Type | Description
--- | --- | ---
fn | function():boolean | The function to evaluate as a wait condition.
timeout | number | How long to wait for the condition to be true.
opt_message | string= | An optional message to use if the wait times out.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the wait condition has been satisfied.


##<a name="api-webdriver-webdriver-prototype-sleep"></a>[webdriver.WebDriver.prototype.sleep](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#547)

Schedules a command to make the driver sleep for the given amount of time.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time, in milliseconds, to sleep.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the sleep has finished.


##<a name="api-webdriver-webdriver-prototype-getwindowhandle"></a>[webdriver.WebDriver.prototype.getWindowHandle](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#558)

Schedules a command to retrieve they current window handle.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the current window handle.


##<a name="api-webdriver-webdriver-prototype-getallwindowhandles"></a>[webdriver.WebDriver.prototype.getAllWindowHandles](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#570)

Schedules a command to retrieve the current list of available window handles.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;string&gt;&gt; | A promise that will be resolved with an array of window handles.


##<a name="api-webdriver-webdriver-prototype-getpagesource"></a>[webdriver.WebDriver.prototype.getPageSource](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#582)

Schedules a command to retrieve the current page's source. The page source
returned is a representation of the underlying DOM: do not expect it to be
formatted or escaped in the same way as the response sent from the web
server.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the current page source.


##<a name="api-webdriver-webdriver-prototype-close"></a>[webdriver.WebDriver.prototype.close](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#597)

Schedules a command to close the current window.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when this command has completed.


##<a name="api-webdriver-webdriver-prototype-get"></a>[webdriver.WebDriver.prototype.get](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#608)

Schedules a command to navigate to the given URL.




###Params

Param | Type | Description
--- | --- | ---
url | string | The fully qualified URL to open.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the document has finished loading.


##<a name="api-webdriver-webdriver-prototype-getcurrenturl"></a>[webdriver.WebDriver.prototype.getCurrentUrl](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#619)

Schedules a command to retrieve the URL of the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the current URL.


##<a name="api-webdriver-webdriver-prototype-gettitle"></a>[webdriver.WebDriver.prototype.getTitle](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#631)

Schedules a command to retrieve the current page's title.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the current page's title.


##<a name="api-webdriver-webdriver-prototype-findelement"></a>[webdriver.WebDriver.prototype.findElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#642)

Schedule a command to find an element on the page. If the element cannot be
found, a {@link bot.ErrorCode.NO_SUCH_ELEMENT} result will be returned
by the driver. Unlike other commands, this error cannot be suppressed. In
other words, scheduling a command to find an element doubles as an assert
that the element is present on the page. To test whether an element is
present on the page, use {@link #isElementPresent} instead.

<p>The search criteria for an element may be defined using one of the
factories in the {@link webdriver.By} namespace, or as a short-hand
{@link webdriver.By.Hash} object. For example, the following two statements
are equivalent:
<code><pre>
var e1 = driver.findElement(By.id('foo'));
var e2 = driver.findElement({id:'foo'});
</pre></code>

<p>You may also provide a custom locator function, which takes as input
this WebDriver instance and returns a {@link webdriver.WebElement}, or a
promise that will resolve to a WebElement. For example, to find the first
visible link on a page, you could write:
<code><pre>
var link = driver.findElement(firstVisibleLink);

function firstVisibleLink(driver) {
  var links = driver.findElements(By.tagName('a'));
  return webdriver.promise.filter(links, function(link) {
    return links.isDisplayed();
  }).then(function(visibleLinks) {
    return visibleLinks[0];
  });
}
</pre></code>

<p>When running in the browser, a WebDriver cannot manipulate DOM elements
directly; it may do so only through a {@link webdriver.WebElement} reference.
This function may be used to generate a WebElement from a DOM element. A
reference to the DOM element will be stored in a known location and this
driver will attempt to retrieve it through {@link #executeScript}. If the
element cannot be found (eg, it belongs to a different document than the
one this instance is currently focused on), a
{@link bot.ErrorCode.NO_SUCH_ELEMENT} error will be returned.




###Params

Param | Type | Description
--- | --- | ---
locator | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Element&#124;Function) | The locator to use.




###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | A WebElement that can be used to issue commands against the located element. If the element is not found, the element will be invalidated and all scheduled commands aborted.


##<a name="api-webdriver-webdriver-prototype-iselementpresent"></a>[webdriver.WebDriver.prototype.isElementPresent](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#785)

Schedules a command to test if an element is present on the page.

<p>If given a DOM element, this function will check if it belongs to the
document the driver is currently focused on. Otherwise, the function will
test if at least one element can be found with the given search criteria.




###Params

Param | Type | Description
--- | --- | ---
locatorOrElement | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Element&#124;
          Function) | The locator to use, or the actual DOM element to be located by the server.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;boolean&gt; | A promise that will resolve with whether the element is present on the page.


##<a name="api-webdriver-webdriver-prototype-findelements"></a>[webdriver.WebDriver.prototype.findElements](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#810)

Schedule a command to search for multiple elements on the page.




###Params

Param | Type | Description
--- | --- | ---
locator | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Function) | The locator strategy to use when searching for the element.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.WebElement&gt;&gt; | A promise that will resolve to an array of WebElements.


##<a name="api-webdriver-webdriver-prototype-takescreenshot"></a>[webdriver.WebDriver.prototype.takeScreenshot](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#857)

Schedule a command to take a screenshot. The driver makes a best effort to
return a screenshot of the following, in order of preference:
<ol>
  <li>Entire page
  <li>Current window
  <li>Visible portion of the current frame
  <li>The screenshot of the entire display containing the browser
</ol>






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved to the screenshot as a base-64 encoded PNG.


##<a name="api-webdriver-webdriver-prototype-manage"></a>[webdriver.WebDriver.prototype.manage](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#876)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Options](#webdriverwebdriveroptions) | The options interface for this instance.


##<a name="api-webdriver-webdriver-prototype-navigate"></a>[webdriver.WebDriver.prototype.navigate](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#885)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Navigation](#webdriverwebdrivernavigation) | The navigation interface for this instance.


##<a name="api-webdriver-webdriver-prototype-switchto"></a>[webdriver.WebDriver.prototype.switchTo](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#894)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.TargetLocator](#webdriverwebdrivertargetlocator) | The target locator interface for this instance.


##<a name="api-webdriver-webdriver-navigation"></a>[webdriver.WebDriver.Navigation](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#904)

Interface for navigating back and forth in the browser history.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##<a name="api-webdriver-webdriver-navigation-prototype-to"></a>[webdriver.WebDriver.Navigation.prototype.to](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#916)

Schedules a command to navigate to a new URL.




###Params

Param | Type | Description
--- | --- | ---
url | string | The URL to navigate to.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the URL has been loaded.


##<a name="api-webdriver-webdriver-navigation-prototype-back"></a>[webdriver.WebDriver.Navigation.prototype.back](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#930)

Schedules a command to move backwards in the browser history.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the navigation event has completed.


##<a name="api-webdriver-webdriver-navigation-prototype-forward"></a>[webdriver.WebDriver.Navigation.prototype.forward](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#942)

Schedules a command to move forwards in the browser history.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the navigation event has completed.


##<a name="api-webdriver-webdriver-navigation-prototype-refresh"></a>[webdriver.WebDriver.Navigation.prototype.refresh](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#954)

Schedules a command to refresh the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the navigation event has completed.


##<a name="api-webdriver-webdriver-options"></a>[webdriver.WebDriver.Options](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#967)

Provides methods for managing browser and driver state.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##<a name="api-webdriver-webdriver-options-prototype-addcookie"></a>[webdriver.WebDriver.Options.prototype.addCookie](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#994)

Schedules a command to add a cookie.




###Params

Param | Type | Description
--- | --- | ---
name | string | The cookie name.
value | string | The cookie value.
opt_path | string= | The cookie path.
opt_domain | string= | The cookie domain.
opt_isSecure | boolean= | Whether the cookie is secure.
opt_expiry | (number&#124;!Date)= | When the cookie expires. If specified as a number, should be in milliseconds since midnight, January 1, 1970 UTC.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the cookie has been added to the page.


##<a name="api-webdriver-webdriver-options-prototype-deleteallcookies"></a>[webdriver.WebDriver.Options.prototype.deleteAllCookies](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1051)

Schedules a command to delete all cookies visible to the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when all cookies have been deleted.


##<a name="api-webdriver-webdriver-options-prototype-deletecookie"></a>[webdriver.WebDriver.Options.prototype.deleteCookie](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1063)

Schedules a command to delete the cookie with the given name. This command is
a no-op if there is no cookie with the given name visible to the current
page.




###Params

Param | Type | Description
--- | --- | ---
name | string | The name of the cookie to delete.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the cookie has been deleted.


##<a name="api-webdriver-webdriver-options-prototype-getcookies"></a>[webdriver.WebDriver.Options.prototype.getCookies](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1079)

Schedules a command to retrieve all cookies visible to the current page.
Each cookie will be returned as a JSON object as described by the WebDriver
wire protocol.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;
    !Array.&lt;webdriver.WebDriver.Options.Cookie&gt;&gt; | A promise that will be resolved with the cookies visible to the current page.


##<a name="api-webdriver-webdriver-options-prototype-getcookie"></a>[webdriver.WebDriver.Options.prototype.getCookie](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1095)

Schedules a command to retrieve the cookie with the given name. Returns null
if there is no such cookie. The cookie will be returned as a JSON object as
described by the WebDriver wire protocol.




###Params

Param | Type | Description
--- | --- | ---
name | string | The name of the cookie to retrieve.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;?webdriver.WebDriver.Options.Cookie&gt; | A promise that will be resolved with the named cookie, or {@code null} if there is no such cookie.


##<a name="api-webdriver-webdriver-options-prototype-logs"></a>[webdriver.WebDriver.Options.prototype.logs](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1114)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Logs](#webdriverwebdriverlogs) | The interface for managing driver logs.


##<a name="api-webdriver-webdriver-options-prototype-timeouts"></a>[webdriver.WebDriver.Options.prototype.timeouts](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1123)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Timeouts](#webdriverwebdrivertimeouts) | The interface for managing driver timeouts.


##<a name="api-webdriver-webdriver-options-prototype-window"></a>[webdriver.WebDriver.Options.prototype.window](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1132)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Window](#webdriverwebdriverwindow) | The interface for managing the current window.


##<a name="api-webdriver-webdriver-timeouts"></a>[webdriver.WebDriver.Timeouts](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1142)

An interface for managing timeout behavior for WebDriver instances.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##<a name="api-webdriver-webdriver-timeouts-prototype-implicitlywait"></a>[webdriver.WebDriver.Timeouts.prototype.implicitlyWait](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1154)

Specifies the amount of time the driver should wait when searching for an
element if it is not immediately present.
<p/>
When searching for a single element, the driver should poll the page
until the element has been found, or this timeout expires before failing
with a {@code bot.ErrorCode.NO_SUCH_ELEMENT} error. When searching
for multiple elements, the driver should poll the page until at least one
element has been found or this timeout has expired.
<p/>
Setting the wait timeout to 0 (its default value), disables implicit
waiting.
<p/>
Increasing the implicit wait timeout should be used judiciously as it
will have an adverse effect on test run time, especially when used with
slower location strategies like XPath.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the implicit wait timeout has been set.


##<a name="api-webdriver-webdriver-timeouts-prototype-setscripttimeout"></a>[webdriver.WebDriver.Timeouts.prototype.setScriptTimeout](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1183)

Sets the amount of time to wait, in milliseconds, for an asynchronous script
to finish execution before returning an error. If the timeout is less than or
equal to 0, the script will be allowed to run indefinitely.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the script timeout has been set.


##<a name="api-webdriver-webdriver-timeouts-prototype-pageloadtimeout"></a>[webdriver.WebDriver.Timeouts.prototype.pageLoadTimeout](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1200)

Sets the amount of time to wait for a page load to complete before returning
an error.  If the timeout is negative, page loads may be indefinite.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the timeout has been set.


##<a name="api-webdriver-webdriver-window"></a>[webdriver.WebDriver.Window](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1217)

An interface for managing the current window.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##<a name="api-webdriver-webdriver-window-prototype-getposition"></a>[webdriver.WebDriver.Window.prototype.getPosition](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1229)

Retrieves the window's current position, relative to the top left corner of
the screen.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;{x: number, y: number}&gt; | A promise that will be resolved with the window's position in the form of a {x:number, y:number} object literal.


##<a name="api-webdriver-webdriver-window-prototype-setposition"></a>[webdriver.WebDriver.Window.prototype.setPosition](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1244)

Repositions the current window.




###Params

Param | Type | Description
--- | --- | ---
x | number | The desired horizontal position, relative to the left side of the screen.
y | number | The desired vertical position, relative to the top of the of the screen.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the command has completed.


##<a name="api-webdriver-webdriver-window-prototype-getsize"></a>[webdriver.WebDriver.Window.prototype.getSize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1263)

Retrieves the window's current size.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;{width: number, height: number}&gt; | A promise that will be resolved with the window's size in the form of a {width:number, height:number} object literal.


##<a name="api-webdriver-webdriver-window-prototype-setsize"></a>[webdriver.WebDriver.Window.prototype.setSize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1277)

Resizes the current window.




###Params

Param | Type | Description
--- | --- | ---
width | number | The desired window width.
height | number | The desired window height.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the command has completed.


##<a name="api-webdriver-webdriver-window-prototype-maximize"></a>[webdriver.WebDriver.Window.prototype.maximize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1294)

Maximizes the current window.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the command has completed.


##<a name="api-webdriver-webdriver-logs"></a>[webdriver.WebDriver.Logs](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1307)

Interface for managing WebDriver log records.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##<a name="api-webdriver-webdriver-logs-prototype-get"></a>[webdriver.WebDriver.Logs.prototype.get](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1319)

Fetches available log entries for the given type.

<p/>Note that log buffers are reset after each call, meaning that
available log entries correspond to those entries not yet returned for a
given log type. In practice, this means that this call will return the
available log entries since the last call, or from the start of the
session.




###Params

Param | Type | Description
--- | --- | ---
type | !webdriver.logging.Type | The desired log type.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.logging.Entry&gt;&gt; | A promise that will resolve to a list of log entries for the specified type.


##<a name="api-webdriver-webdriver-logs-prototype-getavailablelogtypes"></a>[webdriver.WebDriver.Logs.prototype.getAvailableLogTypes](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1350)

Retrieves the log types available to this driver.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.logging.Type&gt;&gt; | A promise that will resolve to a list of available log types.


##<a name="api-webdriver-webdriver-targetlocator"></a>[webdriver.WebDriver.TargetLocator](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1363)

An interface for changing the focus of the driver to another frame or window.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##<a name="api-webdriver-webdriver-targetlocator-prototype-activeelement"></a>[webdriver.WebDriver.TargetLocator.prototype.activeElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1375)

Schedules a command retrieve the {@code document.activeElement} element on
the current document, or {@code document.body} if activeElement is not
available.






###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | The active element.


##<a name="api-webdriver-webdriver-targetlocator-prototype-defaultcontent"></a>[webdriver.WebDriver.TargetLocator.prototype.defaultContent](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1389)

Schedules a command to switch focus of all future commands to the first frame
on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the driver has changed focus to the default content.


##<a name="api-webdriver-webdriver-targetlocator-prototype-frame"></a>[webdriver.WebDriver.TargetLocator.prototype.frame](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1403)

Schedules a command to switch the focus of all future commands to another
frame on the page.
<p/>
If the frame is specified by a number, the command will switch to the frame
by its (zero-based) index into the {@code window.frames} collection.
<p/>
If the frame is specified by a string, the command will select the frame by
its name or ID. To select sub-frames, simply separate the frame names/IDs by
dots. As an example, "main.child" will select the frame with the name "main"
and then its child "child".
<p/>
If the specified frame can not be found, the deferred result will errback
with a {@code bot.ErrorCode.NO_SUCH_FRAME} error.




###Params

Param | Type | Description
--- | --- | ---
nameOrIndex | string&#124;number | The frame locator.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the driver has changed focus to the specified frame.


##<a name="api-webdriver-webdriver-targetlocator-prototype-window"></a>[webdriver.WebDriver.TargetLocator.prototype.window](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1429)

Schedules a command to switch the focus of all future commands to another
window. Windows may be specified by their {@code window.name} attribute or
by its handle (as returned by {@code webdriver.WebDriver#getWindowHandles}).
<p/>
If the specificed window can not be found, the deferred result will errback
with a {@code bot.ErrorCode.NO_SUCH_WINDOW} error.




###Params

Param | Type | Description
--- | --- | ---
nameOrHandle | string | The name or window handle of the window to switch focus to.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the driver has changed focus to the specified window.


##<a name="api-webdriver-webdriver-targetlocator-prototype-alert"></a>[webdriver.WebDriver.TargetLocator.prototype.alert](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1449)

Schedules a command to change focus to the active alert dialog. This command
will return a {@link bot.ErrorCode.NO_MODAL_DIALOG_OPEN} error if a modal
dialog is not currently open.






###Returns

Type | Description
--- | ---
&#33;[webdriver.Alert](#webdriveralert) | The open alert.


##<a name="api-webdriver-key-chord"></a>[webdriver.Key.chord](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1463)

Simulate pressing many keys at once in a "chord". Takes a sequence of
{@link webdriver.Key}s or strings, appends each of the values to a string,
and adds the chord termination key ({@link webdriver.Key.NULL}) and returns
the resultant string.

Note: when the low-level webdriver key handlers see Keys.NULL, active
modifier keys (CTRL/ALT/SHIFT/etc) release via a keyup event.




###Params

Param | Type | Description
--- | --- | ---
var_args | ...string | The key sequence to concatenate.




###Returns

Type | Description
--- | ---
string | The null-terminated key sequence.


##<a name="api-webdriver-webelement"></a>[webdriver.WebElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1495)

Represents a DOM element. WebElements can be found by searching from the
document root using a {@code webdriver.WebDriver} instance, or by searching
under another {@code webdriver.WebElement}:
<pre><code>
  driver.get('http://www.google.com');
  var searchForm = driver.findElement(By.tagName('form'));
  var searchBox = searchForm.findElement(By.name('q'));
  searchBox.sendKeys('webdriver');
</code></pre>

The WebElement is implemented as a promise for compatibility with the promise
API. It will always resolve itself when its internal state has been fully
resolved and commands may be issued against the element. This can be used to
catch errors when an element cannot be located on the page:
<pre><code>
  driver.findElement(By.id('not-there')).then(function(element) {
    alert('Found an element that was not expected to be there!');
  }, function(error) {
    alert('The element was not found, as expected');
  });
</code></pre>




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent WebDriver instance for this element.
id | !(string&#124;webdriver.promise.Promise) | Either the opaque ID for the underlying DOM element assigned by the server, or a promise that will resolve to that ID or another WebElement.





##<a name="api-webdriver-webelement-equals"></a>[webdriver.WebElement.equals](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1585)

Compares to WebElements for equality.




###Params

Param | Type | Description
--- | --- | ---
a | &#33;[webdriver.WebElement](#webdriverwebelement) | A WebElement.
b | &#33;[webdriver.WebElement](#webdriverwebelement) | A WebElement.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;boolean&gt; | A promise that will be resolved to whether the two WebElements are equal.


##<a name="api-webdriver-webelement-prototype-getdriver"></a>[webdriver.WebElement.prototype.getDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1613)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver for this instance.


##<a name="api-webdriver-webelement-prototype-towirevalue"></a>[webdriver.WebElement.prototype.toWireValue](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1621)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;webdriver.WebElement.Id&gt; | A promise that resolves to this element's JSON representation as defined by the WebDriver wire protocol.


##<a name="api-webdriver-webelement-prototype-findelement"></a>[webdriver.WebElement.prototype.findElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1650)

Schedule a command to find a descendant of this element. If the element
cannot be found, a {@code bot.ErrorCode.NO_SUCH_ELEMENT} result will
be returned by the driver. Unlike other commands, this error cannot be
suppressed. In other words, scheduling a command to find an element doubles
as an assert that the element is present on the page. To test whether an
element is present on the page, use {@code #isElementPresent} instead.

<p>The search criteria for an element may be defined using one of the
factories in the {@link webdriver.By} namespace, or as a short-hand
{@link webdriver.By.Hash} object. For example, the following two statements
are equivalent:
<code><pre>
var e1 = element.findElement(By.id('foo'));
var e2 = element.findElement({id:'foo'});
</pre></code>

<p>You may also provide a custom locator function, which takes as input
this WebDriver instance and returns a {@link webdriver.WebElement}, or a
promise that will resolve to a WebElement. For example, to find the first
visible link on a page, you could write:
<code><pre>
var link = element.findElement(firstVisibleLink);

function firstVisibleLink(element) {
  var links = element.findElements(By.tagName('a'));
  return webdriver.promise.filter(links, function(link) {
    return links.isDisplayed();
  }).then(function(visibleLinks) {
    return visibleLinks[0];
  });
}
</pre></code>




###Params

Param | Type | Description
--- | --- | ---
locator | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Function) | The locator strategy to use when searching for the element.




###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | A WebElement that can be used to issue commands against the located element. If the element is not found, the element will be invalidated and all scheduled commands aborted.


##<a name="api-webdriver-webelement-prototype-iselementpresent"></a>[webdriver.WebElement.prototype.isElementPresent](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1706)

Schedules a command to test if there is at least one descendant of this
element that matches the given search criteria.




###Params

Param | Type | Description
--- | --- | ---
locator | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Function) | The locator strategy to use when searching for the element.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;boolean&gt; | A promise that will be resolved with whether an element could be located on the page.


##<a name="api-webdriver-webelement-prototype-findelements"></a>[webdriver.WebElement.prototype.findElements](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1722)

Schedules a command to find all of the descendants of this element that
match the given search criteria.




###Params

Param | Type | Description
--- | --- | ---
locator | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Function) | The locator strategy to use when searching for the elements.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.WebElement&gt;&gt; | A promise that will resolve to an array of WebElements.


##<a name="api-webdriver-webelement-prototype-click"></a>[webdriver.WebElement.prototype.click](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1745)

Schedules a command to click on this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the click command has completed.


##<a name="api-webdriver-webelement-prototype-sendkeys"></a>[webdriver.WebElement.prototype.sendKeys](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1757)

Schedules a command to type a sequence on the DOM element represented by this
instance.
<p/>
Modifier keys (SHIFT, CONTROL, ALT, META) are stateful; once a modifier is
processed in the keysequence, that key state is toggled until one of the
following occurs:
<ul>
<li>The modifier key is encountered again in the sequence. At this point the
state of the key is toggled (along with the appropriate keyup/down events).
</li>
<li>The {@code webdriver.Key.NULL} key is encountered in the sequence. When
this key is encountered, all modifier keys current in the down state are
released (with accompanying keyup events). The NULL key can be used to
simulate common keyboard shortcuts:
<code><pre>
    element.sendKeys("text was",
                     webdriver.Key.CONTROL, "a", webdriver.Key.NULL,
                     "now text is");
    // Alternatively:
    element.sendKeys("text was",
                     webdriver.Key.chord(webdriver.Key.CONTROL, "a"),
                     "now text is");
</pre></code></li>
<li>The end of the keysequence is encountered. When there are no more keys
to type, all depressed modifier keys are released (with accompanying keyup
events).
</li>
</ul>
<strong>Note:</strong> On browsers where native keyboard events are not yet
supported (e.g. Firefox on OS X), key events will be synthesized. Special
punctionation keys will be synthesized according to a standard QWERTY en-us
keyboard layout.




###Params

Param | Type | Description
--- | --- | ---
var_args | ...string | The sequence of keys to type. All arguments will be joined into a single sequence (var_args is permitted for convenience).




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when all keys have been typed.


##<a name="api-webdriver-webelement-prototype-gettagname"></a>[webdriver.WebElement.prototype.getTagName](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1814)

Schedules a command to query for the tag/node name of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the element's tag name.


##<a name="api-webdriver-webelement-prototype-getcssvalue"></a>[webdriver.WebElement.prototype.getCssValue](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1826)

Schedules a command to query for the computed style of the element
represented by this instance. If the element inherits the named style from
its parent, the parent will be queried for its value.  Where possible, color
values will be converted to their hex representation (e.g. #00ff00 instead of
rgb(0, 255, 0)).
<p/>
<em>Warning:</em> the value returned will be as the browser interprets it, so
it may be tricky to form a proper assertion.




###Params

Param | Type | Description
--- | --- | ---
cssStyleProperty | string | The name of the CSS style property to look up.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the requested CSS value.


##<a name="api-webdriver-webelement-prototype-getattribute"></a>[webdriver.WebElement.prototype.getAttribute](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1850)

Schedules a command to query for the value of the given attribute of the
element. Will return the current value, even if it has been modified after
the page has been loaded. More exactly, this method will return the value of
the given attribute, unless that attribute is not present, in which case the
value of the property with the same name is returned. If neither value is
set, null is returned (for example, the "value" property of a textarea
element). The "style" attribute is converted as best can be to a
text representation with a trailing semi-colon. The following are deemed to
be "boolean" attributes and will return either "true" or null:

<p>async, autofocus, autoplay, checked, compact, complete, controls, declare,
defaultchecked, defaultselected, defer, disabled, draggable, ended,
formnovalidate, hidden, indeterminate, iscontenteditable, ismap, itemscope,
loop, multiple, muted, nohref, noresize, noshade, novalidate, nowrap, open,
paused, pubdate, readonly, required, reversed, scoped, seamless, seeking,
selected, spellcheck, truespeed, willvalidate

<p>Finally, the following commonly mis-capitalized attribute/property names
are evaluated as expected:
<ul>
  <li>"class"
  <li>"readonly"
</ul>




###Params

Param | Type | Description
--- | --- | ---
attributeName | string | The name of the attribute to query.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;?string&gt; | A promise that will be resolved with the attribute's value. The returned value will always be either a string or null.


##<a name="api-webdriver-webelement-prototype-gettext"></a>[webdriver.WebElement.prototype.getText](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1887)

Get the visible (i.e. not hidden by CSS) innerText of this element, including
sub-elements, without any leading or trailing whitespace.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the element's visible text.


##<a name="api-webdriver-webelement-prototype-getsize"></a>[webdriver.WebElement.prototype.getSize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1900)

Schedules a command to compute the size of this element's bounding box, in
pixels.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;{width: number, height: number}&gt; | A promise that will be resolved with the element's size as a {@code {width:number, height:number}} object.


##<a name="api-webdriver-webelement-prototype-getlocation"></a>[webdriver.WebElement.prototype.getLocation](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1914)

Schedules a command to compute the location of this element in page space.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;{x: number, y: number}&gt; | A promise that will be resolved to the element's location as a {@code {x:number, y:number}} object.


##<a name="api-webdriver-webelement-prototype-isenabled"></a>[webdriver.WebElement.prototype.isEnabled](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1927)

Schedules a command to query whether the DOM element represented by this
instance is enabled, as dicted by the {@code disabled} attribute.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;boolean&gt; | A promise that will be resolved with whether this element is currently enabled.


##<a name="api-webdriver-webelement-prototype-isselected"></a>[webdriver.WebElement.prototype.isSelected](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1940)

Schedules a command to query whether this element is selected.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;boolean&gt; | A promise that will be resolved with whether this element is currently selected.


##<a name="api-webdriver-webelement-prototype-submit"></a>[webdriver.WebElement.prototype.submit](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1952)

Schedules a command to submit the form containing this element (or this
element if it is a FORM element). This command is a no-op if the element is
not contained in a form.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the form has been submitted.


##<a name="api-webdriver-webelement-prototype-clear"></a>[webdriver.WebElement.prototype.clear](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1966)

Schedules a command to clear the {@code value} of this element. This command
has no effect if the underlying DOM element is neither a text INPUT element
nor a TEXTAREA element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when the element has been cleared.


##<a name="api-webdriver-webelement-prototype-isdisplayed"></a>[webdriver.WebElement.prototype.isDisplayed](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1980)

Schedules a command to test whether this element is currently displayed.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;boolean&gt; | A promise that will be resolved with whether this element is currently visible on the page.


##<a name="api-webdriver-webelement-prototype-getouterhtml"></a>[webdriver.WebElement.prototype.getOuterHtml](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1992)

Schedules a command to retrieve the outer HTML of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the element's outer HTML.


##<a name="api-webdriver-webelement-prototype-getinnerhtml"></a>[webdriver.WebElement.prototype.getInnerHtml](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2011)

Schedules a command to retrieve the inner HTML of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved with the element's inner HTML.


##<a name="api-webdriver-alert"></a>[webdriver.Alert](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2022)

Represents a modal dialog such as {@code alert}, {@code confirm}, or
{@code prompt}. Provides functions to retrieve the message displayed with
the alert, accept or dismiss the alert, and set the response text (in the
case of {@code prompt}).




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The driver controlling the browser this alert is attached to.
text | !(string&#124;webdriver.promise.Promise.&lt;string&gt;) | Either the message text displayed with this alert, or a promise that will be resolved to said text.





##<a name="api-webdriver-alert-prototype-gettext"></a>[webdriver.Alert.prototype.getText](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2058)

Retrieves the message text displayed with this alert. For instance, if the
alert were opened with alert("hello"), then this would return "hello".






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;string&gt; | A promise that will be resolved to the text displayed with this alert.


##<a name="api-webdriver-alert-prototype-accept"></a>[webdriver.Alert.prototype.accept](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2069)

Accepts this alert.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when this command has completed.


##<a name="api-webdriver-alert-prototype-dismiss"></a>[webdriver.Alert.prototype.dismiss](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2081)

Dismisses this alert.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when this command has completed.


##<a name="api-webdriver-alert-prototype-sendkeys"></a>[webdriver.Alert.prototype.sendKeys](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2093)

Sets the response text on this alert. This command will return an error if
the underlying alert does not support response text (e.g. window.alert and
window.confirm).




###Params

Param | Type | Description
--- | --- | ---
text | string | The text to set.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;void&gt; | A promise that will be resolved when this command has completed.


##<a name="api-webdriver-unhandledalerterror"></a>[webdriver.UnhandledAlertError](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2110)

An error returned to indicate that there is an unhandled modal dialog on the
current page.




###Params

Param | Type | Description
--- | --- | ---
message | string | The error message.
alert | &#33;[webdriver.Alert](#webdriveralert) | The alert handle.





##<a name="api-webdriver-unhandledalerterror-prototype-getalert"></a>[webdriver.UnhandledAlertError.prototype.getAlert](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2127)








###Returns

Type | Description
--- | ---
&#33;[webdriver.Alert](#webdriveralert) | The open alert.

