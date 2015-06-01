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
