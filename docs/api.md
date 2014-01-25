Protractor API
==============

Note: in this documentation, `protractor` and `webdriver` refer to namespaces,
and `ptor` and `driver` refer to instances of the Protractor and Webdriver
classes.

Protractor is a wrapper around WebDriver, so anything available on WebDriver
is available on Protractor. The best documentation for both is the code itself.
This file provides an overview and links on where to get more information.

API methods and members that are modified or added by Protractor are marked
with a `P`.

Documentation generated at 92e0fdf07ad775878feba9f16be8fba1015e3753

[WebDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js) and [Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js)
------------------

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#242)  : 
`controlFlow` function(  )  -> _!webdriver.promise.ControlFlow_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#251)  : 
`schedule` function( _!webdriver.Command_ _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#303)  : 
`getSession` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#311)  : 
`getCapabilities` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#322)  : 
`getCapability` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#337)  : 
`quit` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#356)  : 
`actions` function(  )  -> _!webdriver.ActionSequence_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#374)  : 
`executeScript` function( _!(string|Function)_ _...*_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#423)  : 
`executeAsyncScript` function( _!(string|Function)_ _...*_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#514)  : 
`call` function( _!Function_ _Object=_ _...*_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#533)  : 
`wait` function( _function():boolean_ _number_ _string=_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#549)  : 
`sleep` function( _number_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#560)  : 
`getWindowHandle` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#572)  : 
`getAllWindowHandles` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#584)  : 
`getPageSource` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#599)  : 
`close` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#610) [**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L629) : 
`get` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#621)  : 
`getCurrentUrl` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#633)  : 
`getTitle` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#644)  : 
`findElement` function( _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._  )  -> _!webdriver.WebElement_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#718)  : 
`findDomElement_` function( _!Element_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#766)  : 
`isElementPresent` function( _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#793)  : 
`findElements` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#829)  : 
`takeScreenshot` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#848)  : 
`manage` function(  )  -> _!webdriver.WebDriver.Options_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#857)  : 
`navigate` function(  )  -> _!webdriver.WebDriver.Navigation_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#866)  : 
`switchTo` function(  )  -> _!webdriver.WebDriver.TargetLocator_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L395) : 
`waitForAngular` function(  )  -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L424) : 
`wrapWebElement` function( _webdriver.WebElement_  )  -> _webdriver.WebElement_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L607) : 
`addMockModule` function( _!string_ _!string|Function_  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L621) : 
`clearMockModules` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L696) : 
`getLocationAbsUrl` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L704) : 
`debugger` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L738) : 
`findElementsOverrideHelper_` function( _webdriver.WebElement_ _webdriver.Locator_  )  -> _webdriver.WebElement_


Locator Strategies
------------------

The `findElement`, `findElements`, and `isElementPresent` functions take
a _locator strategy_ as their parameter. The following locator strategies
are available:


 : 
`Protractor.By.id` function(  ) 

 : 
`Protractor.By.css` function(  ) 

 : 
`Protractor.By.xpath` function(  ) 

 : 
`Protractor.By.name` function(  ) 

 : 
`Protractor.By.tagName` function(  ) 

 : 
`Protractor.By.className` function(  ) 

 : 
`Protractor.By.linkText` function(  )

 : 
`Protractor.By.partialLinkText` function(  )

 : 
`Protractor.By.js` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L21) : 
`Protractor.By.addLocator` function( _string_ _function|string_  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L44) : 
`Protractor.By.binding` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L60) : 
`Protractor.By.select` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L76) : 
`Protractor.By.selectedOption` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L91) : 
`Protractor.By.input` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L107) : 
`Protractor.By.model` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L122) : 
`Protractor.By.textarea` function(  ) 

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/locators.js#L138) : 
`Protractor.By.repeater` function(  ) 

 :
`Protractor.By.buttonText` function(  )

 :
`Protractor.By.partialButtonText` function(  )


WebElements
-----------

The `findElement` function returns a WebElement object and the `findElements`
function returns a promise that resolves to an array of WebElement objects.
The following functions are available on WebElement objects:

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1559)  : 
`WebElement.getDriver` function(  )  -> _!webdriver.WebDriver_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1567)  : 
`WebElement.toWireValue` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1577)  : 
`WebElement.schedule_` function( _!webdriver.Command_ _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1594) [**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L548) : 
`WebElement.findElement` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _webdriver.WebElement_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1637) [**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L591) : 
`WebElement.isElementPresent` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1662) [**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L566) : 
`WebElement.findElements` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1689)  : 
`WebElement.click` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1701)  : 
`WebElement.sendKeys` function( _...string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1758)  : 
`WebElement.getTagName` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1770)  : 
`WebElement.getCssValue` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1794)  : 
`WebElement.getAttribute` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1831)  : 
`WebElement.getText` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1844)  : 
`WebElement.getSize` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1857)  : 
`WebElement.getLocation` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1869)  : 
`WebElement.isEnabled` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1882)  : 
`WebElement.isSelected` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1894)  : 
`WebElement.submit` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1908)  : 
`WebElement.clear` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1922)  : 
`WebElement.isDisplayed` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1934)  : 
`WebElement.getOuterHtml` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1953)  : 
`WebElement.getInnerHtml` function(  )  -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L149) : 
`WebElement.all` function( _webdriver.Locator_  )  -> _ElementArrayFinder_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L447) : 
`WebElement.$` function( _string_  )  -> _!webdriver.WebElement_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L476) : 
`WebElement.$$` function( _string_  )  -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/92e0fdf07ad775878feba9f16be8fba1015e3753/lib/protractor.js#L529) : 
`WebElement.evaluate` function( _string_  )  -> _!webdriver.promise.Promise_



