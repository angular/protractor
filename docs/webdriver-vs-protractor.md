Protractor Syntax vs WebDriverJS Syntax
=======================================

In vanilla [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs)
code, you might start your tests with 
```js
var webdriver = require('selenium-webdriver');
var browser = new webdriver.Builder().usingServer().withCapabilities(c).build();
```
In Protractor, you are provided with global `protractor` and `browser` objects,
which more or less match the `webdriver` and `browser` objects, respectively.
So if you are already familiar with writing WebDriver code, the most basic way
to start writing Protractor code is just to replace `webdriver` with
`protractor`.

However, Protractor also provides some syntactic sugar to help you write your
tests.


| WebDriver Syntax                              | Protractor Syntax            |
|-----------------------------------------------|------------------------------|
| `webdriver.By`                                | `by`                         |
| `browser.findElement(...)`                    | `element(...)`               |
| `browser.findElements(...)`                   | `element.all(...)`           |
| `browser.findElement(webdriver.By.css(...))`  | `$(...)`                     |
| `browser.findElements(webdriver.By.css(...))` | `$$(...)`                    |

If you need the vanilla WebDriver `browser` object, you can access it via
`browser.driver`

Using ElementFinders
--------------------

In Protractor, you use the `element` function to find and interact with elements
through an `ElementFinder` object. This extends a WebDriver `WebElement` by
adding chaining and utilities for dealing with lists. See
[locators#actions](/docs/locators) for details.

Jasmine Integration
-------------------

Protractor uses [`jasminewd`](https://github.com/angular/jasminewd), which
wraps around jasmine's `expect` so that you can write:
```js
expect(el.getText()).toBe('Hello, World!')
```
Instead of:
```js
el.getText().then(function(text) {
  expect(text).toBe('Hello, World!');
});
```
