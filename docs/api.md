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

Documentation generated at e804f6a0ca9eccc7914d562fada84dfee2c87e50

[WebDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js) and [Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js)
------------------

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#241)  : 
`controlFlow`   -> _!webdriver.promise.ControlFlow_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#250)  : 
`schedule` _!webdriver.Command_ _string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#302)  : 
`getSession`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#310)  : 
`getCapabilities`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#321)  : 
`getCapability` _string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#336)  : 
`quit`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#355)  : 
`actions`   -> _!webdriver.ActionSequence_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#373)  : 
`executeScript` _!(string|Function)_ _...*_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#422)  : 
`executeAsyncScript` _!(string|Function)_ _...*_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#513)  : 
`call` _!Function_ _Object=_ _...*_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#532)  : 
`wait` _function():boolean_ _number_ _string=_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#548)  : 
`sleep` _number_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#559)  : 
`getWindowHandle`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#571)  : 
`getAllWindowHandles`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#583)  : 
`getPageSource`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#598)  : 
`close`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#609) [**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L279) : 
`get` _string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#620)  : 
`getCurrentUrl`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#632)  : 
`getTitle`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#643)  : 
`findElement` _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._   -> _!webdriver.WebElement_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#717)  : 
`findDomElement_` _!Element_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#765)  : 
`isElementPresent` _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#792)  : 
`findElements` _webdriver.Locator|Object.&lt;string&gt;_ _..._   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#828)  : 
`takeScreenshot`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#847)  : 
`manage`   -> _!webdriver.WebDriver.Options_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#856)  : 
`navigate`   -> _!webdriver.WebDriver.Navigation_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#865)  : 
`switchTo`   -> _!webdriver.WebDriver.TargetLocator_

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L98) : 
`waitForAngular`   -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L122) : 
`wrapWebElement` _webdriver.WebElement_  

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L257) : 
`addMockModule` _!string_ _!string|Function_  

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L271) : 
`clearMockModules`  

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L314) : 
`debugger`  


Locator Strategies
------------------

The `findElement`, `findElements`, and `isElementPresent` functions take
a _locator strategy_ as their parameter. The following locator strategies
are avaiable)


 : 
`Protractor.By.id`  

 : 
`Protractor.By.css`  

 : 
`Protractor.By.xpath`  

 : 
`Protractor.By.name`  

 : 
`Protractor.By.tagName`  

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/locators.js#L21) : 
`Protractor.By.binding`  

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/locators.js#L43) : 
`Protractor.By.select`  

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/locators.js#L96) : 
`Protractor.By.repeater`  



WebElements
-----------

The `findElement`, `findElements`, and `isElementPresent` functions return
a WebElement object. The following functions are available on WebElements.

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1556)  : 
`WebElement.getDriver`   -> _!webdriver.WebDriver_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1564)  : 
`WebElement.toWireValue`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1574)  : 
`WebElement.schedule_` _!webdriver.Command_ _string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1591) [**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L208) : 
`WebElement.findElement` _webdriver.Locator|Object.&lt;string&gt;_ _..._   -> _webdriver.WebElement_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1634) [**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L241) : 
`WebElement.isElementPresent` _webdriver.Locator|Object.&lt;string&gt;_ _..._   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1659) [**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L221) : 
`WebElement.findElements` _webdriver.Locator|Object.&lt;string&gt;_ _..._   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1686)  : 
`WebElement.click`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1698)  : 
`WebElement.sendKeys` _...string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1755)  : 
`WebElement.getTagName`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1767)  : 
`WebElement.getCssValue` _string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1791)  : 
`WebElement.getAttribute` _string_   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1826)  : 
`WebElement.getText`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1839)  : 
`WebElement.getSize`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1852)  : 
`WebElement.getLocation`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1864)  : 
`WebElement.isEnabled`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1877)  : 
`WebElement.isSelected`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1889)  : 
`WebElement.submit`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1903)  : 
`WebElement.clear`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1917)  : 
`WebElement.isDisplayed`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1929)  : 
`WebElement.getOuterHtml`   -> _!webdriver.promise.Promise_

[**WD**](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1948)  : 
`WebElement.getInnerHtml`   -> _!webdriver.promise.Promise_

[**P**](https://github.com/angular/protractor/blob/e804f6a0ca9eccc7914d562fada84dfee2c87e50/lib/protractor.js#L189) : 
`WebElement.evaluate` _string_   -> _!webdriver.promise.Promise_



