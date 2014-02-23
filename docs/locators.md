##[ProtractorBy](https://github.com/angular/protractor/blob/master/lib/locators.js#L6)

The Protractor Locators. These provide ways of finding elements in
Angular applications by binding, model, etc.







##[WebdriverBy.prototype](https://github.com/angular/protractor/blob/master/lib/locators.js#L15)

webdriver's By is an enum of locator functions, so we must set it to
a prototype before inheriting from it.







##[ProtractorBy.prototype.addLocator](https://github.com/angular/protractor/blob/master/lib/locators.js#L22)
####by.addLocator()
Add a locator to this instance of ProtractorBy. This locator can then be
used with element(by.<name>(<args>)).




###Params

Param | Type | Description
--- | --- | ---
name | string | null





##[ProtractorBy.prototype.binding](https://github.com/angular/protractor/blob/master/lib/locators.js#L45)
####by.binding()
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
bindingDescriptor | string | null




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.select](https://github.com/angular/protractor/blob/master/lib/locators.js#L74)

DEPRECATED - use 'model' instead.


###Example

```html
<select ng-model="user" ng-options="user.name for user in users"></select>
```

```javascript
element(by.select('user'));
```






##[ProtractorBy.prototype.selectedOption](https://github.com/angular/protractor/blob/master/lib/locators.js#L93)




###Example

```html
<select ng-model="user" ng-options="user.name for user in users"></select>
```

```javascript
element(by.selectedOption("user"));
```






##[ProtractorBy.prototype.input](https://github.com/angular/protractor/blob/master/lib/locators.js#L110)




###Example

```html
<input ng-model="user" type="text"/>
```

```javascript
element(by.input('user'));
```






##[ProtractorBy.prototype.model](https://github.com/angular/protractor/blob/master/lib/locators.js#L128)
####by.model()
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





##[ProtractorBy.prototype.buttonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L152)

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
searchText | string | null




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.partialButtonText](https://github.com/angular/protractor/blob/master/lib/locators.js#L174)

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
searchText | string | null




###Returns

Type | Description
--- | ---
{findElementsOverride: findElementsOverride, message: string} | 


##[ProtractorBy.prototype.textarea](https://github.com/angular/protractor/blob/master/lib/locators.js#L197)

DEPRECATED - use 'model' instead.


###Example

```html
<textarea ng-model="user"></textarea>
```

```javascript
element(by.textarea('user'));
```






##[ProtractorBy.prototype.repeater](https://github.com/angular/protractor/blob/master/lib/locators.js#L215)

Find elements inside an ng-repeat.


###Example

```html
<div ng-repeat = "cat in pets">
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





