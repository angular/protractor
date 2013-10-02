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

Methods

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#241)
controlFlow   ->_!webdriver.promise.ControlFlow_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#250)
schedule _!webdriver.Command_ _string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#302)
getSession   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#310)
getCapabilities   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#321)
getCapability _string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#336)
quit   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#355)
actions   ->_!webdriver.ActionSequence_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#373)
executeScript _!(string|Function)_ _...*_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#422)
executeAsyncScript _!(string|Function)_ _...*_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#513)
call _!Function_ _Object=_ _...*_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#532)
wait _function():boolean_ _number_ _string=_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#548)
sleep _number_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#559)
getWindowHandle   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#571)
getAllWindowHandles   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#583)
getPageSource   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#598)
close   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#609) [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L279)
get _string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#620)
getCurrentUrl   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#632)
getTitle   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#643)
findElement _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._   ->_!webdriver.WebElement_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#717)
findDomElement_ _!Element_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#765)
isElementPresent _!(webdriver.Locator|Object.&lt;string&gt;|Element)_ _..._   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#792)
findElements _webdriver.Locator|Object.&lt;string&gt;_ _..._   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#828)
takeScreenshot   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#847)
manage   ->_!webdriver.WebDriver.Options_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#856)
navigate   ->_!webdriver.WebDriver.Navigation_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#865)
switchTo   ->_!webdriver.WebDriver.TargetLocator_

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L98)
waitForAngular   ->_!webdriver.promise.Promise_

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L122)
wrapWebElement _webdriver.WebElement_  

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L257)
addMockModule _!string_ _!string|Function_  

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L271)
clearMockModules  

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L314)
debugger  


Locator Strategies
------------------

The `findElement`, `findElements`, and `isElementPresent` functions take
a _locator strategy_ as their parameter. The following locator strategies
are avaiable)



Protractor.By.id  


Protractor.By.css  


Protractor.By.xpath  


Protractor.By.name  


Protractor.By.tagName  

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;locators.js#L21)
Protractor.By.binding  

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;locators.js#L43)
Protractor.By.select  

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;locators.js#L96)
Protractor.By.repeater  



WebElements
-----------

The `findElement`, `findElements`, and `isElementPresent` functions return
a WebElement object. The following functions are available on WebElements.

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1556)
WebElement.getDriver   ->_!webdriver.WebDriver_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1564)
WebElement.toWireValue   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1574)
WebElement.schedule_ _!webdriver.Command_ _string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1591) [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L208)
WebElement.findElement _webdriver.Locator|Object.&lt;string&gt;_ _..._   ->_webdriver.WebElement_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1634) [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L241)
WebElement.isElementPresent _webdriver.Locator|Object.&lt;string&gt;_ _..._   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1659) [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L221)
WebElement.findElements _webdriver.Locator|Object.&lt;string&gt;_ _..._   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1686)
WebElement.click   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1698)
WebElement.sendKeys _...string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1755)
WebElement.getTagName   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1767)
WebElement.getCssValue _string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1791)
WebElement.getAttribute _string_   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1826)
WebElement.getText   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1839)
WebElement.getSize   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1852)
WebElement.getLocation   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1864)
WebElement.isEnabled   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1877)
WebElement.isSelected   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1889)
WebElement.submit   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1903)
WebElement.clear   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1917)
WebElement.isDisplayed   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1929)
WebElement.getOuterHtml   ->_!webdriver.promise.Promise_

[WD](https:&#x2F;&#x2F;code.google.com&#x2F;p&#x2F;selenium&#x2F;source&#x2F;browse&#x2F;javascript&#x2F;webdriver&#x2F;webdriver.js?name=selenium-2.35.0#1948)
WebElement.getInnerHtml   ->_!webdriver.promise.Promise_

 [P](https:&#x2F;&#x2F;github.com&#x2F;angular&#x2F;protractor&#x2F;blob&#x2F;e804f6a0ca9eccc7914d562fada84dfee2c87e50&#x2F;lib&#x2F;protractor.js#L189)
WebElement.evaluate _string_   ->_!webdriver.promise.Promise_



