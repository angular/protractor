##[ProtractorBy](https://github.com/angular/protractor/blob/master/lib/locators.js#L6)
The Protractor Locators. These provide ways of finding elements in
Angular applications by binding, model, etc.







##[WebdriverBy.prototype](https://github.com/angular/protractor/blob/master/lib/locators.js#L15)
webdriver's By is an enum of locator functions, so we must set it to
a prototype before inheriting from it.







##[ProtractorBy.prototype.addLocator](https://github.com/angular/protractor/blob/master/lib/locators.js#L22)
Add a locator to this instance of ProtractorBy. This locator can then be
used with element(by.<name>(<args>)).




###Params

Param | Type | Description
--- | --- | ---
name | string | null





##[ProtractorBy.prototype.binding](https://github.com/angular/protractor/blob/master/lib/locators.js#L44)
Find an element by binding.




###Example
```
  <span>{{status}}</span>
  var status = element(by.binding('{{status}}'));
```



###Params

Param | Type | Description
--- | --- | ---
bindingDescriptor | string | null




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.select](https://github.com/angular/protractor/blob/master/lib/locators.js#L65)
DEPRECATED - use 'model' instead.




###Example
```
  <select ng-model="user" ng-options="user.name for user in users"></select>
  element(by.select("user"));
```






##[ProtractorBy.prototype.selectedOption](https://github.com/angular/protractor/blob/master/lib/locators.js#L82)



###Example
```
  <select ng-model="user" ng-options="user.name for user in users"></select>
  element(by.selectedOption("user"));
```






##[ProtractorBy.prototype.input](https://github.com/angular/protractor/blob/master/lib/locators.js#L97)








##[ProtractorBy.prototype.model](https://github.com/angular/protractor/blob/master/lib/locators.js#L113)



###Example
```
  <input ng-model="user" type="text"/>
  element(by.model('user'));
```






##[ProtractorBy.prototype.buttonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L128)
Find a button by text.




###Example
```
  <button>Save</button>
  element(by.buttonText("Save"));
```



###Params

Param | Type | Description
--- | --- | ---
searchText | string | null




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.partialButtonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L148)
Find a button by partial text.




###Example
```
  <button>Save my file</button>
  element(by.partialButtonText("Save"));
```



###Params

Param | Type | Description
--- | --- | ---
searchText | string | null




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.textarea](https://github.com/angular/protractor/blob/master/lib/locators.js#L169)








##[ProtractorBy.prototype.repeater](https://github.com/angular/protractor/blob/master/lib/locators.js#L185)



###Example
```
  <div ng-repeat = "cat in pets">
    <span>{{cat.name}}</span>
    <span>{{cat.age}}</span>
  </div>

// Returns the DIV for the second cat.
var secondCat = element(by.repeater("cat in pets").row(1));
// Returns the SPAN for the first cat's name.
var firstCatName = element(
    by.repeater("cat in pets").row(0).column("{{cat.name}}"));
// Returns a promise that resolves to an array of WebElements from a column
var ages = element.all(
    by.repeater("cat in pets").column("{{cat.age}}"));
// Returns a promise that resolves to an array of WebElements containing
// all rows of the repeater.
var rows = element.all(by.repeater("cat in pets"));
```





