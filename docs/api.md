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

[WebDriver](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js) and [Protractor](https://github.com/angular/protractor/blob/master/lib/protractor.js)
------------------

Methods


[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#246)
controlFlow = function()

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#259)
schedule = function(command, description)

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#306)
getSession = function()

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#315)
getCapabilities = function()

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#330)
getCapability = function(name)

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#344)
quit = function()

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#369)
actions = function()

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#411)
executeScript = function(script, var_args)

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#502)
executeAsyncScript = function(script, var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#522)
call = function(fn, opt_scope, var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#544)
wait = function(fn, timeout, opt_message) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#555)
sleep = function(ms) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#565)
getWindowHandle = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#577)
getAllWindowHandles = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#592)
getPageSource = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#604)
close = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#616)
[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L286)
get = function(url) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#626)
getCurrentUrl = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#638)
getTitle = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#680)
[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L214)
findElement = function(locatorOrElement)

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#781)
[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L248)
isElementPresent = function(locatorOrElement)

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#803)
[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L228)
findElements = function(locator, var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#842)
takeScreenshot = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#852)
manage = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#861)
navigate = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#870)
switchTo = function() 

[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L106)
waitForAngular = function()

[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L128)
wrapWebElement = function(element) 

[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L267)
addMockModule = function(name, script) 

[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L275)
clearMockModules = function() 

[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L333)
debugger = function() 


Locator Strategies
------------------

The `findElement`, `findElements`, and `isElementPresent` functions take
a _locator strategy_ as their parameter. The following locator strategies
are avaiable)

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.id

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.css

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.className

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.name

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.tagName

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.xpath

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.partialLinkText

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/locators.js#66)
WebDriver.By.js

[P](https://github.com/angular/protractor/blob/master/lib/locator.js#L30)
Protractor.By.binding = function(bindingDescriptor) 

[P](https://github.com/angular/protractor/blob/master/lib/locator.js#L49)
Protractor.By.select = function(model) 

[P](https://github.com/angular/protractor/blob/master/lib/locator.js#L62)
Protractor.By.selectedOption = function(model) 

[P](https://github.com/angular/protractor/blob/master/lib/locator.js#L75)
Protractor.By.input = function(model) 

[P](https://github.com/angular/protractor/blob/master/lib/locator.js#L88)
Protractor.By.textarea = function(model) 

[P](https://github.com/angular/protractor/blob/master/lib/locator.js#L114)
Protractor.By.repeater = function(repeatDescriptor) 



WebElements
-----------

The `findElement`, `findElements`, and `isElementPresent` functions return
a WebElement object. The following functions are available on WebElements.

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1560)
getDriver = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1570)
toWireValue = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1586)
schedule_ = function(command, description) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1621)
findElement = function(locator, var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1649)
isElementPresent = function(locator, var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1674)
findElements = function(locator, var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1692)
click = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1739)
sendKeys = function(var_args) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1761)
getTagName = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1783)
getCssValue = function(cssStyleProperty) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1819)
getAttribute = function(attributeName) 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1833)
getText = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1846)
getSize = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1858)
getLocation = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1871)
isEnabled = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1883)
isSelected = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1897)
submit = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1911)
clear = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1923)
isDisplayed = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1935)
getOuterHtml = function() 

[WD](https://code.google.com/p/selenium/source/browse/javascript/webdriver/webdriver.js#1954)
getInnerHtml = function() 

[P](https://github.com/angular/protractor/blob/master/lib/protractor.js#L200)
evaluate = function(expression)
