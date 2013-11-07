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

Documentation generated at 8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a

[WebDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js) and [Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js)
------------------

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#241)  : 
`controlFlow` function(  )  -> _!webdriver.promise.ControlFlow_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#250)  : 
`schedule` function( _!webdriver.Command_ _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#302)  : 
`getSession` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#310)  : 
`getCapabilities` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#321)  : 
`getCapability` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#336)  : 
`quit` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#355)  : 
`actions` function(  )  -> _!webdriver.ActionSequence_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#373)  : 
`executeScript` function( _!(string|Function)_ _...*_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#422)  : 
`executeAsyncScript` function( _!(string|Function)_ _...*_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#513)  : 
`call` function( _!Function_ _Object=_ _...*_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#532)  : 
`wait` function( _function():boolean_ _number_ _string=_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#548)  : 
`sleep` function( _number_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#559)  : 
`getWindowHandle` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#571)  : 
`getAllWindowHandles` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#583)  : 
`getPageSource` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#598)  : 
`close` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#609) [**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L463) : 
`get` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#620)  : 
`getCurrentUrl` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#632)  : 
`getTitle` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#643)  : 
`findElement` function( _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._  )  -> _!webdriver.WebElement_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#717)  : 
`findDomElement_` function( _!Element_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#765)  : 
`isElementPresent` function( _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#792)  : 
`findElements` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#828)  : 
`takeScreenshot` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#847)  : 
`manage` function(  )  -> _!webdriver.WebDriver.Options_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#856)  : 
`navigate` function(  )  -> _!webdriver.WebDriver.Navigation_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#865)  : 
`switchTo` function(  )  -> _!webdriver.WebDriver.TargetLocator_

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L235) : 
`waitForAngular` function(  )  -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L259) : 
`wrapWebElement` function( _webdriver.WebElement_  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L441) : 
`addMockModule` function( _!string_ _!string|Function_  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L455) : 
`clearMockModules` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L498) : 
`debugger` function(  ) 


Locator Strategies
------------------

The `findElement`, `findElements`, and `isElementPresent` functions take
a _locator strategy_ as their parameter. The following locator strategies
are avaiable)


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

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L21) : 
`Protractor.By.binding` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L43) : 
`Protractor.By.select` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L61) : 
`Protractor.By.selectedOption` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L79) : 
`Protractor.By.input` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L98) : 
`Protractor.By.model` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L116) : 
`Protractor.By.textarea` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/locators.js#L130) : 
`Protractor.By.repeater` function(  ) 



WebElements
-----------

The `findElement`, `findElements`, and `isElementPresent` functions return
a WebElement object. The following functions are available on WebElements.

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1556)  : 
`WebElement.getDriver` function(  )  -> _!webdriver.WebDriver_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1564)  : 
`WebElement.toWireValue` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1574)  : 
`WebElement.schedule_` function( _!webdriver.Command_ _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1591) [**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L382) : 
`WebElement.findElement` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _webdriver.WebElement_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1634) [**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L425) : 
`WebElement.isElementPresent` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1659) [**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L400) : 
`WebElement.findElements` function( _webdriver.Locator|Object.&lt;string&gt;_ _..._  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1686)  : 
`WebElement.click` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1698)  : 
`WebElement.sendKeys` function( _...string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1755)  : 
`WebElement.getTagName` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1767)  : 
`WebElement.getCssValue` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1791)  : 
`WebElement.getAttribute` function( _string_  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1826)  : 
`WebElement.getText` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1839)  : 
`WebElement.getSize` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1852)  : 
`WebElement.getLocation` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1864)  : 
`WebElement.isEnabled` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1877)  : 
`WebElement.isSelected` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1889)  : 
`WebElement.submit` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1903)  : 
`WebElement.clear` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1917)  : 
`WebElement.isDisplayed` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1929)  : 
`WebElement.getOuterHtml` function(  )  -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1948)  : 
`WebElement.getInnerHtml` function(  )  -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L87) : 
`WebElement.all` function(  ) 

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L281) : 
`WebElement.$` function( _string_  )  -> _!webdriver.WebElement_

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L310) : 
`WebElement.$$` function( _string_  )  -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a/lib/protractor.js#L363) : 
`WebElement.evaluate` function( _string_  )  -> _!webdriver.promise.Promise_



