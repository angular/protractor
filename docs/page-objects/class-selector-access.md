Class Selector Access
=====================

Since frequently you will be asked to expose elements of your angular application to QA teams so they
can write their own Selenium automation or so you can simply write your own you may want to put special
classes on each of your elements.

Simple example of a button exposed for QA access:

```
<div>
    <a ng-click="register()" class="button protractor-register-btn">Register</a>
</div>
```

Then within your Page Object you can use a function like this:

```javascript
var RegisterPageModel = function() {

    this.clickRegisterButton = function() {
        element(by.className('protractor-register-btn')).click()
    }

    this.findRegistrationButton = function() {
        return element(by.className('protractor-registration-btn'))
    }

}

module.exports = RegisterPageModel;
```