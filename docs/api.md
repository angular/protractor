Protractor API 0.20.1
==============



##protractor

* [element](#element)
* [elementFinder.find](#elementfinderfind)
* [elementFinder.isPresent](#elementfinderispresent)
* [elementFinder.element](#elementfinderelement)
* [elementFinder.$](#elementfinder)
* [element.all](#elementall)
* [elementArrayFinder.count](#elementarrayfindercount)
* [elementArrayFinder.get](#elementarrayfinderget)
* [elementArrayFinder.first](#elementarrayfinderfirst)
* [elementArrayFinder.last](#elementarrayfinderlast)
* [elementArrayFinder.each](#elementarrayfindereach)
* [elementArrayFinder.map](#elementarrayfindermap)
* [Protractor](#protractor)
* [Protractor.prototype.waitForAngular](#protractorprototypewaitforangular)
* [Protractor.prototype.wrapWebElement](#protractorprototypewrapwebelement)
* [element.$](#element)
* [element.findElement](#elementfindelement)
* [element.$$](#element)
* [element.findElements](#elementfindelements)
* [element.isElementPresent](#elementiselementpresent)
* [element.evaluate](#elementevaluate)
* [Protractor.prototype.findElement](#protractorprototypefindelement)
* [Protractor.prototype.findElements](#protractorprototypefindelements)
* [Protractor.prototype.isElementPresent](#protractorprototypeiselementpresent)
* [Protractor.prototype.addMockModule](#protractorprototypeaddmockmodule)
* [Protractor.prototype.clearMockModules](#protractorprototypeclearmockmodules)
* [Protractor.prototype.removeMockModule](#protractorprototyperemovemockmodule)
* [Protractor.prototype.get](#protractorprototypeget)
* [Protractor.prototype.getLocationAbsUrl](#protractorprototypegetlocationabsurl)
* [Protractor.prototype.debugger](#protractorprototypedebugger)

##locators

* [ProtractorBy](#protractorby)
* [WebdriverBy.prototype](#webdriverbyprototype)
* [ProtractorBy.prototype.addLocator](#protractorbyprototypeaddlocator)
* [ProtractorBy.prototype.binding](#protractorbyprototypebinding)
* [ProtractorBy.prototype.select](#protractorbyprototypeselect)
* [ProtractorBy.prototype.selectedOption](#protractorbyprototypeselectedoption)
* [ProtractorBy.prototype.input](#protractorbyprototypeinput)
* [ProtractorBy.prototype.model](#protractorbyprototypemodel)
* [ProtractorBy.prototype.buttonText](#protractorbyprototypebuttontext)
* [ProtractorBy.prototype.partialButtonText](#protractorbyprototypepartialbuttontext)
* [ProtractorBy.prototype.textarea](#protractorbyprototypetextarea)
* [ProtractorBy.prototype.repeater](#protractorbyprototyperepeater)

##webdriver

* [webdriver.WebDriver](#webdriverwebdriver)
* [webdriver.WebDriver.attachToSession](#webdriverwebdriverattachtosession)
* [webdriver.WebDriver.createSession](#webdriverwebdrivercreatesession)
* [webdriver.WebDriver.prototype.controlFlow](#webdriverwebdriverprototypecontrolflow)
* [webdriver.WebDriver.prototype.schedule](#webdriverwebdriverprototypeschedule)
* [webdriver.WebDriver.prototype.getSession](#webdriverwebdriverprototypegetsession)
* [webdriver.WebDriver.prototype.getCapabilities](#webdriverwebdriverprototypegetcapabilities)
* [webdriver.WebDriver.prototype.quit](#webdriverwebdriverprototypequit)
* [webdriver.WebDriver.prototype.actions](#webdriverwebdriverprototypeactions)
* [webdriver.WebDriver.prototype.executeScript](#webdriverwebdriverprototypeexecutescript)
* [webdriver.WebDriver.prototype.executeAsyncScript](#webdriverwebdriverprototypeexecuteasyncscript)
* [webdriver.WebDriver.prototype.call](#webdriverwebdriverprototypecall)
* [webdriver.WebDriver.prototype.wait](#webdriverwebdriverprototypewait)
* [webdriver.WebDriver.prototype.sleep](#webdriverwebdriverprototypesleep)
* [webdriver.WebDriver.prototype.getWindowHandle](#webdriverwebdriverprototypegetwindowhandle)
* [webdriver.WebDriver.prototype.getAllWindowHandles](#webdriverwebdriverprototypegetallwindowhandles)
* [webdriver.WebDriver.prototype.getPageSource](#webdriverwebdriverprototypegetpagesource)
* [webdriver.WebDriver.prototype.close](#webdriverwebdriverprototypeclose)
* [webdriver.WebDriver.prototype.get](#webdriverwebdriverprototypeget)
* [webdriver.WebDriver.prototype.getCurrentUrl](#webdriverwebdriverprototypegetcurrenturl)
* [webdriver.WebDriver.prototype.getTitle](#webdriverwebdriverprototypegettitle)
* [webdriver.WebDriver.prototype.findElement](#webdriverwebdriverprototypefindelement)
* [webdriver.WebDriver.prototype.isElementPresent](#webdriverwebdriverprototypeiselementpresent)
* [webdriver.WebDriver.prototype.findElements](#webdriverwebdriverprototypefindelements)
* [webdriver.WebDriver.prototype.takeScreenshot](#webdriverwebdriverprototypetakescreenshot)
* [webdriver.WebDriver.prototype.manage](#webdriverwebdriverprototypemanage)
* [webdriver.WebDriver.prototype.navigate](#webdriverwebdriverprototypenavigate)
* [webdriver.WebDriver.prototype.switchTo](#webdriverwebdriverprototypeswitchto)
* [webdriver.WebDriver.Navigation](#webdriverwebdrivernavigation)
* [webdriver.WebDriver.Navigation.prototype.to](#webdriverwebdrivernavigationprototypeto)
* [webdriver.WebDriver.Navigation.prototype.back](#webdriverwebdrivernavigationprototypeback)
* [webdriver.WebDriver.Navigation.prototype.forward](#webdriverwebdrivernavigationprototypeforward)
* [webdriver.WebDriver.Navigation.prototype.refresh](#webdriverwebdrivernavigationprototyperefresh)
* [webdriver.WebDriver.Options](#webdriverwebdriveroptions)
* [webdriver.WebDriver.Options.prototype.addCookie](#webdriverwebdriveroptionsprototypeaddcookie)
* [webdriver.WebDriver.Options.prototype.deleteAllCookies](#webdriverwebdriveroptionsprototypedeleteallcookies)
* [webdriver.WebDriver.Options.prototype.deleteCookie](#webdriverwebdriveroptionsprototypedeletecookie)
* [webdriver.WebDriver.Options.prototype.getCookies](#webdriverwebdriveroptionsprototypegetcookies)
* [webdriver.WebDriver.Options.prototype.getCookie](#webdriverwebdriveroptionsprototypegetcookie)
* [webdriver.WebDriver.Options.prototype.logs](#webdriverwebdriveroptionsprototypelogs)
* [webdriver.WebDriver.Options.prototype.timeouts](#webdriverwebdriveroptionsprototypetimeouts)
* [webdriver.WebDriver.Options.prototype.window](#webdriverwebdriveroptionsprototypewindow)
* [webdriver.WebDriver.Timeouts](#webdriverwebdrivertimeouts)
* [webdriver.WebDriver.Timeouts.prototype.implicitlyWait](#webdriverwebdrivertimeoutsprototypeimplicitlywait)
* [webdriver.WebDriver.Timeouts.prototype.setScriptTimeout](#webdriverwebdrivertimeoutsprototypesetscripttimeout)
* [webdriver.WebDriver.Timeouts.prototype.pageLoadTimeout](#webdriverwebdrivertimeoutsprototypepageloadtimeout)
* [webdriver.WebDriver.Window](#webdriverwebdriverwindow)
* [webdriver.WebDriver.Window.prototype.getPosition](#webdriverwebdriverwindowprototypegetposition)
* [webdriver.WebDriver.Window.prototype.setPosition](#webdriverwebdriverwindowprototypesetposition)
* [webdriver.WebDriver.Window.prototype.getSize](#webdriverwebdriverwindowprototypegetsize)
* [webdriver.WebDriver.Window.prototype.setSize](#webdriverwebdriverwindowprototypesetsize)
* [webdriver.WebDriver.Window.prototype.maximize](#webdriverwebdriverwindowprototypemaximize)
* [webdriver.WebDriver.Logs](#webdriverwebdriverlogs)
* [webdriver.WebDriver.Logs.prototype.get](#webdriverwebdriverlogsprototypeget)
* [webdriver.WebDriver.Logs.prototype.getAvailableLogTypes](#webdriverwebdriverlogsprototypegetavailablelogtypes)
* [webdriver.WebDriver.TargetLocator](#webdriverwebdrivertargetlocator)
* [webdriver.WebDriver.TargetLocator.prototype.activeElement](#webdriverwebdrivertargetlocatorprototypeactiveelement)
* [webdriver.WebDriver.TargetLocator.prototype.defaultContent](#webdriverwebdrivertargetlocatorprototypedefaultcontent)
* [webdriver.WebDriver.TargetLocator.prototype.frame](#webdriverwebdrivertargetlocatorprototypeframe)
* [webdriver.WebDriver.TargetLocator.prototype.window](#webdriverwebdrivertargetlocatorprototypewindow)
* [webdriver.WebDriver.TargetLocator.prototype.alert](#webdriverwebdrivertargetlocatorprototypealert)
* [webdriver.Key.chord](#webdriverkeychord)
* [webdriver.WebElement](#webdriverwebelement)
* [webdriver.WebElement.equals](#webdriverwebelementequals)
* [webdriver.WebElement.prototype.getDriver](#webdriverwebelementprototypegetdriver)
* [webdriver.WebElement.prototype.toWireValue](#webdriverwebelementprototypetowirevalue)
* [webdriver.WebElement.prototype.findElement](#webdriverwebelementprototypefindelement)
* [webdriver.WebElement.prototype.isElementPresent](#webdriverwebelementprototypeiselementpresent)
* [webdriver.WebElement.prototype.findElements](#webdriverwebelementprototypefindelements)
* [webdriver.WebElement.prototype.click](#webdriverwebelementprototypeclick)
* [webdriver.WebElement.prototype.sendKeys](#webdriverwebelementprototypesendkeys)
* [webdriver.WebElement.prototype.getTagName](#webdriverwebelementprototypegettagname)
* [webdriver.WebElement.prototype.getCssValue](#webdriverwebelementprototypegetcssvalue)
* [webdriver.WebElement.prototype.getAttribute](#webdriverwebelementprototypegetattribute)
* [webdriver.WebElement.prototype.getText](#webdriverwebelementprototypegettext)
* [webdriver.WebElement.prototype.getSize](#webdriverwebelementprototypegetsize)
* [webdriver.WebElement.prototype.getLocation](#webdriverwebelementprototypegetlocation)
* [webdriver.WebElement.prototype.isEnabled](#webdriverwebelementprototypeisenabled)
* [webdriver.WebElement.prototype.isSelected](#webdriverwebelementprototypeisselected)
* [webdriver.WebElement.prototype.submit](#webdriverwebelementprototypesubmit)
* [webdriver.WebElement.prototype.clear](#webdriverwebelementprototypeclear)
* [webdriver.WebElement.prototype.isDisplayed](#webdriverwebelementprototypeisdisplayed)
* [webdriver.WebElement.prototype.getOuterHtml](#webdriverwebelementprototypegetouterhtml)
* [webdriver.WebElement.prototype.getInnerHtml](#webdriverwebelementprototypegetinnerhtml)
* [webdriver.Alert](#webdriveralert)
* [webdriver.Alert.prototype.getText](#webdriveralertprototypegettext)
* [webdriver.Alert.prototype.accept](#webdriveralertprototypeaccept)
* [webdriver.Alert.prototype.dismiss](#webdriveralertprototypedismiss)
* [webdriver.Alert.prototype.sendKeys](#webdriveralertprototypesendkeys)
* [webdriver.UnhandledAlertError](#webdriverunhandledalerterror)
* [webdriver.UnhandledAlertError.prototype.getAlert](#webdriverunhandledalerterrorprototypegetalert)

##[element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L65)
#### Use as: element(locator)
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


##[elementFinder.find](https://github.com/angular/protractor/blob/master/lib/protractor.js#L117)
#### Use as: element(locator).find()
Return the actual WebElement.






###Returns

Type | Description
--- | ---
[webdriver.WebElement](#webdriverwebelement) | 


##[elementFinder.isPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L127)
#### Use as: element(locator).isPresent()
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


##[elementFinder.element](https://github.com/angular/protractor/blob/master/lib/protractor.js#L149)
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
ptor | [Protractor](#protractor) | 
opt_usingChain | Array.&lt;webdriver.Locator&gt;= | 




###Returns

Type | Description
--- | ---
function(webdriver.Locator): ElementFinder | 


##[elementFinder.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L180)
#### Use as: element(locator).$(cssSelector)
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


##[element.all](https://github.com/angular/protractor/blob/master/lib/protractor.js#L212)
#### Use as: element.all(locator)
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


##[elementArrayFinder.count](https://github.com/angular/protractor/blob/master/lib/protractor.js#L236)
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


##[elementArrayFinder.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L260)
#### Use as: element.all(locator).get(index)
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
[webdriver.WebElement](#webdriverwebelement) | The element at the given index


##[elementArrayFinder.first](https://github.com/angular/protractor/blob/master/lib/protractor.js#L286)
#### Use as: element.all(locator).first()
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
[webdriver.WebElement](#webdriverwebelement) | The first matching element


##[elementArrayFinder.last](https://github.com/angular/protractor/blob/master/lib/protractor.js#L313)
#### Use as: element.all(locator).last()
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
[webdriver.WebElement](#webdriverwebelement) | the last matching element


##[elementArrayFinder.each](https://github.com/angular/protractor/blob/master/lib/protractor.js#L345)
#### Use as: element.all(locator).each(eachFunction)
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
fn | function([webdriver.WebElement](#webdriverwebelement)) | Input function





##[elementArrayFinder.map](https://github.com/angular/protractor/blob/master/lib/protractor.js#L372)
#### Use as: element.all(locator).map(mapFunction)
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
mapFn | function([webdriver.WebElement](#webdriverwebelement), number) | Map function that will be applied to each element.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to an array of values returned by the map function.


##[Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js#L450)






###Params

Param | Type | Description
--- | --- | ---
webdriver | [webdriver.WebDriver](#webdriverwebdriver) | 
opt_baseUrl | string= | A base URL to run get requests against.
opt_rootElement | string= | Selector element that has an ng-app in scope.





##[Protractor.prototype.waitForAngular](https://github.com/angular/protractor/blob/master/lib/protractor.js#L543)

Instruct webdriver to wait until Angular has finished rendering and has
no outstanding $http calls before continuing.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[Protractor.prototype.wrapWebElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L584)

Wrap a webdriver.WebElement with protractor specific functionality.




###Params

Param | Type | Description
--- | --- | ---
element | [webdriver.WebElement](#webdriverwebelement) | 




###Returns

Type | Description
--- | ---
[webdriver.WebElement](#webdriverwebelement) | the wrapped web element.


##[element.$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L607)
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
&#33;[webdriver.WebElement](#webdriverwebelement) | 


##[element.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L630)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | 


##[element.$$](https://github.com/angular/protractor/blob/master/lib/protractor.js#L647)
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
!webdriver.promise.Promise | A promise that will be resolved to an array of the located [webdriver.WebElement](#webdriverwebelement)s.


##[element.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L677)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located [webdriver.WebElement](#webdriverwebelement)s.


##[element.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L701)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether an element could be located on the page.


##[element.evaluate](https://github.com/angular/protractor/blob/master/lib/protractor.js#L717)

Evaluates the input as if it were on the scope of the current element.




###Params

Param | Type | Description
--- | --- | ---
expression | string | 




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to the evaluated expression. The result will be resolved as in {@link webdriver.WebDriver.executeScript}. In summary - primitives will be resolved as is, functions will be converted to string, and elements will be returned as a WebElement.


##[Protractor.prototype.findElement](https://github.com/angular/protractor/blob/master/lib/protractor.js#L736)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | 


##[Protractor.prototype.findElements](https://github.com/angular/protractor/blob/master/lib/protractor.js#L754)

Waits for Angular to finish rendering before searching for elements.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to an array of the located [webdriver.WebElement](#webdriverwebelement)s.


##[Protractor.prototype.isElementPresent](https://github.com/angular/protractor/blob/master/lib/protractor.js#L779)

Tests if an element is present on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve to whether the element is present on the page.


##[Protractor.prototype.addMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L795)

Add a module to load before Angular whenever Protractor.get is called.
Modules will be registered after existing modules already on the page,
so any module registered here will override preexisting modules with the same
name.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to load or override.
script | !string&#124;Function | The JavaScript to load the module.





##[Protractor.prototype.clearMockModules](https://github.com/angular/protractor/blob/master/lib/protractor.js#L809)

Clear the list of registered mock modules.







##[Protractor.prototype.removeMockModule](https://github.com/angular/protractor/blob/master/lib/protractor.js#L817)

Remove a registered mock module.




###Params

Param | Type | Description
--- | --- | ---
name | !string | The name of the module to remove.





##[Protractor.prototype.get](https://github.com/angular/protractor/blob/master/lib/protractor.js#L827)

See webdriver.WebDriver.get

Navigate to the given destination and loads mock modules before
Angular. Assumes that the page being loaded uses Angular.
If you need to access a page which does have Angular on load, use
the wrapped webdriver directly.




###Params

Param | Type | Description
--- | --- | ---
destination | string | Destination URL.
opt_timeout | number= | Number of seconds to wait for Angular to start.





##[Protractor.prototype.getLocationAbsUrl](https://github.com/angular/protractor/blob/master/lib/protractor.js#L894)

Returns the current absolute url from AngularJS.







##[Protractor.prototype.debugger](https://github.com/angular/protractor/blob/master/lib/protractor.js#L902)

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







##[ProtractorBy](https://github.com/angular/protractor/blob/master/lib/locators.js#L6)

The Protractor Locators. These provide ways of finding elements in
Angular applications by binding, model, etc.







##[WebdriverBy.prototype](https://github.com/angular/protractor/blob/master/lib/locators.js#L15)

webdriver's By is an enum of locator functions, so we must set it to
a prototype before inheriting from it.







##[ProtractorBy.prototype.addLocator](https://github.com/angular/protractor/blob/master/lib/locators.js#L22)
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





##[ProtractorBy.prototype.binding](https://github.com/angular/protractor/blob/master/lib/locators.js#L73)
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
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.select](https://github.com/angular/protractor/blob/master/lib/locators.js#L102)

**DEPRECATED** Use 'model' instead.


###Example

```html
<select ng-model="user" ng-options="user.name for user in users"></select>
```

```javascript
element(by.select('user'));
```






##[ProtractorBy.prototype.selectedOption](https://github.com/angular/protractor/blob/master/lib/locators.js#L121)




###Example

```html
<select ng-model="user" ng-options="user.name for user in users"></select>
```

```javascript
element(by.selectedOption("user"));
```






##[ProtractorBy.prototype.input](https://github.com/angular/protractor/blob/master/lib/locators.js#L138)

**DEPRECATED** Use 'model' instead.


###Example

```html
<input ng-model="user" type="text"/>
```

```javascript
element(by.input('user'));
```






##[ProtractorBy.prototype.model](https://github.com/angular/protractor/blob/master/lib/locators.js#L156)
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





##[ProtractorBy.prototype.buttonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L180)

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
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.partialButtonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L203)

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
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.textarea](https://github.com/angular/protractor/blob/master/lib/locators.js#L227)

**DEPRECATED** Use 'model' instead.


###Example

```html
<textarea ng-model="user"></textarea>
```

```javascript
element(by.textarea('user'));
```






##[ProtractorBy.prototype.repeater](https://github.com/angular/protractor/blob/master/lib/locators.js#L245)

Find elements inside an ng-repeat.


###Example

```html
<div ng-repeat="cat in pets">
  <span>{{cat.name}}</span>
  <span>{{cat.age}}</span>
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
// all rows of the repeater.
var rows = element.all(by.repeater('cat in pets'));
```






##[webdriver.WebDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#47)

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





##[webdriver.WebDriver.attachToSession](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#87)

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


##[webdriver.WebDriver.createSession](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#102)

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


##[webdriver.WebDriver.prototype.controlFlow](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#243)








###Returns

Type | Description
--- | ---
!webdriver.promise.ControlFlow | The control flow used by this instance.


##[webdriver.WebDriver.prototype.schedule](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#252)

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
!webdriver.promise.Promise | A promise that will be resolved with the command result.


##[webdriver.WebDriver.prototype.getSession](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#304)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise for this client's session.


##[webdriver.WebDriver.prototype.getCapabilities](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#312)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will resolve with the this instance's capabilities.


##[webdriver.WebDriver.prototype.quit](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#323)

Schedules a command to quit the current session. After calling quit, this
instance will be invalidated and may no longer be used to issue commands
against the browser.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.prototype.actions](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#342)

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


##[webdriver.WebDriver.prototype.executeScript](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#360)

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
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[webdriver.WebDriver.prototype.executeAsyncScript](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#409)

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
!webdriver.promise.Promise | A promise that will resolve to the scripts return value.


##[webdriver.WebDriver.prototype.call](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#500)

Schedules a command to execute a custom function.




###Params

Param | Type | Description
--- | --- | ---
fn | !Function | The function to execute.
opt_scope | Object= | The object in whose scope to execute the function.
var_args | ...* | Any arguments to pass to the function.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the function's result.


##[webdriver.WebDriver.prototype.wait](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#519)

Schedules a command to wait for a condition to hold, as defined by some
user supplied function. If any errors occur while evaluating the wait, they
will be allowed to propagate.




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


##[webdriver.WebDriver.prototype.sleep](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#535)

Schedules a command to make the driver sleep for the given amount of time.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time, in milliseconds, to sleep.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the sleep has finished.


##[webdriver.WebDriver.prototype.getWindowHandle](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#546)

Schedules a command to retrieve they current window handle.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current window handle.


##[webdriver.WebDriver.prototype.getAllWindowHandles](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#558)

Schedules a command to retrieve the current list of available window handles.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with an array of window handles.


##[webdriver.WebDriver.prototype.getPageSource](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#570)

Schedules a command to retrieve the current page's source. The page source
returned is a representation of the underlying DOM: do not expect it to be
formatted or escaped in the same way as the response sent from the web
server.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current page source.


##[webdriver.WebDriver.prototype.close](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#585)

Schedules a command to close the current window.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.WebDriver.prototype.get](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#596)

Schedules a command to navigate to the given URL.




###Params

Param | Type | Description
--- | --- | ---
url | string | The fully qualified URL to open.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the document has finished loading.


##[webdriver.WebDriver.prototype.getCurrentUrl](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#607)

Schedules a command to retrieve the URL of the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current URL.


##[webdriver.WebDriver.prototype.getTitle](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#619)

Schedules a command to retrieve the current page's title.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the current page's title.


##[webdriver.WebDriver.prototype.findElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#630)

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


##[webdriver.WebDriver.prototype.isElementPresent](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#777)

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


##[webdriver.WebDriver.prototype.findElements](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#801)

Schedule a command to search for multiple elements on the page.




###Params

Param | Type | Description
--- | --- | ---
locator | !(webdriver.Locator&#124;webdriver.By.Hash&#124;Function) | The locator strategy to use when searching for the element.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.WebElement&gt;&gt; | A promise that will resolve to an array of WebElements.


##[webdriver.WebDriver.prototype.takeScreenshot](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#848)

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
!webdriver.promise.Promise | A promise that will be resolved to the screenshot as a base-64 encoded PNG.


##[webdriver.WebDriver.prototype.manage](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#867)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Options](#webdriverwebdriveroptions) | The options interface for this instance.


##[webdriver.WebDriver.prototype.navigate](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#876)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Navigation](#webdriverwebdrivernavigation) | The navigation interface for this instance.


##[webdriver.WebDriver.prototype.switchTo](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#885)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.TargetLocator](#webdriverwebdrivertargetlocator) | The target locator interface for this instance.


##[webdriver.WebDriver.Navigation](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#895)

Interface for navigating back and forth in the browser history.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##[webdriver.WebDriver.Navigation.prototype.to](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#907)

Schedules a command to navigate to a new URL.




###Params

Param | Type | Description
--- | --- | ---
url | string | The URL to navigate to.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the URL has been loaded.


##[webdriver.WebDriver.Navigation.prototype.back](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#921)

Schedules a command to move backwards in the browser history.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the navigation event has completed.


##[webdriver.WebDriver.Navigation.prototype.forward](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#933)

Schedules a command to move forwards in the browser history.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the navigation event has completed.


##[webdriver.WebDriver.Navigation.prototype.refresh](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#945)

Schedules a command to refresh the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the navigation event has completed.


##[webdriver.WebDriver.Options](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#958)

Provides methods for managing browser and driver state.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##[webdriver.WebDriver.Options.prototype.addCookie](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#970)

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
!webdriver.promise.Promise | A promise that will be resolved when the cookie has been added to the page.


##[webdriver.WebDriver.Options.prototype.deleteAllCookies](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1027)

Schedules a command to delete all cookies visible to the current page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when all cookies have been deleted.


##[webdriver.WebDriver.Options.prototype.deleteCookie](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1039)

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
!webdriver.promise.Promise | A promise that will be resolved when the cookie has been deleted.


##[webdriver.WebDriver.Options.prototype.getCookies](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1055)

Schedules a command to retrieve all cookies visible to the current page.
Each cookie will be returned as a JSON object as described by the WebDriver
wire protocol.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the cookies visible to the current page.


##[webdriver.WebDriver.Options.prototype.getCookie](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1070)

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
!webdriver.promise.Promise | A promise that will be resolved with the named cookie, or {@code null} if there is no such cookie.


##[webdriver.WebDriver.Options.prototype.logs](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1088)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Logs](#webdriverwebdriverlogs) | The interface for managing driver logs.


##[webdriver.WebDriver.Options.prototype.timeouts](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1097)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Timeouts](#webdriverwebdrivertimeouts) | The interface for managing driver timeouts.


##[webdriver.WebDriver.Options.prototype.window](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1106)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver.Window](#webdriverwebdriverwindow) | The interface for managing the current window.


##[webdriver.WebDriver.Timeouts](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1116)

An interface for managing timeout behavior for WebDriver instances.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##[webdriver.WebDriver.Timeouts.prototype.implicitlyWait](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1128)

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
!webdriver.promise.Promise | A promise that will be resolved when the implicit wait timeout has been set.


##[webdriver.WebDriver.Timeouts.prototype.setScriptTimeout](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1157)

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
!webdriver.promise.Promise | A promise that will be resolved when the script timeout has been set.


##[webdriver.WebDriver.Timeouts.prototype.pageLoadTimeout](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1174)

Sets the amount of time to wait for a page load to complete before returning
an error.  If the timeout is negative, page loads may be indefinite.




###Params

Param | Type | Description
--- | --- | ---
ms | number | The amount of time to wait, in milliseconds.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the timeout has been set.


##[webdriver.WebDriver.Window](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1191)

An interface for managing the current window.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##[webdriver.WebDriver.Window.prototype.getPosition](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1203)

Retrieves the window's current position, relative to the top left corner of
the screen.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the window's position in the form of a {x:number, y:number} object literal.


##[webdriver.WebDriver.Window.prototype.setPosition](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1217)

Repositions the current window.




###Params

Param | Type | Description
--- | --- | ---
x | number | The desired horizontal position, relative to the left side of the screen.
y | number | The desired vertical position, relative to the top of the of the screen.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.Window.prototype.getSize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1236)

Retrieves the window's current size.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the window's size in the form of a {width:number, height:number} object literal.


##[webdriver.WebDriver.Window.prototype.setSize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1250)

Resizes the current window.




###Params

Param | Type | Description
--- | --- | ---
width | number | The desired window width.
height | number | The desired window height.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.Window.prototype.maximize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1267)

Maximizes the current window.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the command has completed.


##[webdriver.WebDriver.Logs](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1280)

Interface for managing WebDriver log records.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##[webdriver.WebDriver.Logs.prototype.get](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1292)

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


##[webdriver.WebDriver.Logs.prototype.getAvailableLogTypes](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1323)

Retrieves the log types available to this driver.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise.&lt;!Array.&lt;!webdriver.logging.Type&gt;&gt; | A promise that will resolve to a list of available log types.


##[webdriver.WebDriver.TargetLocator](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1336)

An interface for changing the focus of the driver to another frame or window.




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver.





##[webdriver.WebDriver.TargetLocator.prototype.activeElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1348)

Schedules a command retrieve the {@code document.activeElement} element on
the current document, or {@code document.body} if activeElement is not
available.






###Returns

Type | Description
--- | ---
&#33;[webdriver.WebElement](#webdriverwebelement) | The active element.


##[webdriver.WebDriver.TargetLocator.prototype.defaultContent](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1362)

Schedules a command to switch focus of all future commands to the first frame
on the page.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the driver has changed focus to the default content.


##[webdriver.WebDriver.TargetLocator.prototype.frame](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1376)

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
!webdriver.promise.Promise | A promise that will be resolved when the driver has changed focus to the specified frame.


##[webdriver.WebDriver.TargetLocator.prototype.window](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1402)

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
!webdriver.promise.Promise | A promise that will be resolved when the driver has changed focus to the specified window.


##[webdriver.WebDriver.TargetLocator.prototype.alert](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1422)

Schedules a command to change focus to the active alert dialog. This command
will return a {@link bot.ErrorCode.NO_MODAL_DIALOG_OPEN} error if a modal
dialog is not currently open.






###Returns

Type | Description
--- | ---
&#33;[webdriver.Alert](#webdriveralert) | The open alert.


##[webdriver.Key.chord](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1436)

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


##[webdriver.WebElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1468)

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





##[webdriver.WebElement.equals](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1550)

Compares to WebElements for equality.




###Params

Param | Type | Description
--- | --- | ---
a | &#33;[webdriver.WebElement](#webdriverwebelement) | A WebElement.
b | &#33;[webdriver.WebElement](#webdriverwebelement) | A WebElement.




###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to whether the two WebElements are equal.


##[webdriver.WebElement.prototype.getDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1578)








###Returns

Type | Description
--- | ---
&#33;[webdriver.WebDriver](#webdriverwebdriver) | The parent driver for this instance.


##[webdriver.WebElement.prototype.toWireValue](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1586)








###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that resolves to this element's JSON representation as defined by the WebDriver wire protocol.


##[webdriver.WebElement.prototype.findElement](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1613)

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


##[webdriver.WebElement.prototype.isElementPresent](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1669)

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


##[webdriver.WebElement.prototype.findElements](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1685)

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


##[webdriver.WebElement.prototype.click](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1708)

Schedules a command to click on this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the click command has completed.


##[webdriver.WebElement.prototype.sendKeys](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1720)

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
!webdriver.promise.Promise | A promise that will be resolved when all keys have been typed.


##[webdriver.WebElement.prototype.getTagName](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1777)

Schedules a command to query for the tag/node name of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's tag name.


##[webdriver.WebElement.prototype.getCssValue](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1789)

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
!webdriver.promise.Promise | A promise that will be resolved with the requested CSS value.


##[webdriver.WebElement.prototype.getAttribute](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1813)

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
!webdriver.promise.Promise | A promise that will be resolved with the attribute's value. The returned value will always be either a string or null.


##[webdriver.WebElement.prototype.getText](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1850)

Get the visible (i.e. not hidden by CSS) innerText of this element, including
sub-elements, without any leading or trailing whitespace.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's visible text.


##[webdriver.WebElement.prototype.getSize](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1863)

Schedules a command to compute the size of this element's bounding box, in
pixels.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's size as a {@code {width:number, height:number}} object.


##[webdriver.WebElement.prototype.getLocation](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1876)

Schedules a command to compute the location of this element in page space.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to the element's location as a {@code {x:number, y:number}} object.


##[webdriver.WebElement.prototype.isEnabled](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1888)

Schedules a command to query whether the DOM element represented by this
instance is enabled, as dicted by the {@code disabled} attribute.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether this element is currently enabled.


##[webdriver.WebElement.prototype.isSelected](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1901)

Schedules a command to query whether this element is selected.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether this element is currently selected.


##[webdriver.WebElement.prototype.submit](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1913)

Schedules a command to submit the form containing this element (or this
element if it is a FORM element). This command is a no-op if the element is
not contained in a form.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the form has been submitted.


##[webdriver.WebElement.prototype.clear](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1927)

Schedules a command to clear the {@code value} of this element. This command
has no effect if the underlying DOM element is neither a text INPUT element
nor a TEXTAREA element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when the element has been cleared.


##[webdriver.WebElement.prototype.isDisplayed](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1941)

Schedules a command to test whether this element is currently displayed.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with whether this element is currently visible on the page.


##[webdriver.WebElement.prototype.getOuterHtml](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1953)

Schedules a command to retrieve the outer HTML of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's outer HTML.


##[webdriver.WebElement.prototype.getInnerHtml](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1972)

Schedules a command to retrieve the inner HTML of this element.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved with the element's inner HTML.


##[webdriver.Alert](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1983)

Represents a modal dialog such as {@code alert}, {@code confirm}, or
{@code prompt}. Provides functions to retrieve the message displayed with
the alert, accept or dismiss the alert, and set the response text (in the
case of {@code prompt}).




###Params

Param | Type | Description
--- | --- | ---
driver | &#33;[webdriver.WebDriver](#webdriverwebdriver) | The driver controlling the browser this alert is attached to.
text | !(string&#124;webdriver.promise.Promise) | Either the message text displayed with this alert, or a promise that will be resolved to said text.





##[webdriver.Alert.prototype.getText](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2019)

Retrieves the message text displayed with this alert. For instance, if the
alert were opened with alert("hello"), then this would return "hello".






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved to the text displayed with this alert.


##[webdriver.Alert.prototype.accept](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2030)

Accepts this alert.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.Alert.prototype.dismiss](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2042)

Dismisses this alert.






###Returns

Type | Description
--- | ---
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.Alert.prototype.sendKeys](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2054)

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
!webdriver.promise.Promise | A promise that will be resolved when this command has completed.


##[webdriver.UnhandledAlertError](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2071)

An error returned to indicate that there is an unhandled modal dialog on the
current page.




###Params

Param | Type | Description
--- | --- | ---
message | string | The error message.
alert | &#33;[webdriver.Alert](#webdriveralert) | The alert handle.





##[webdriver.UnhandledAlertError.prototype.getAlert](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#2088)








###Returns

Type | Description
--- | ---
&#33;[webdriver.Alert](#webdriveralert) | The open alert.

