# 0.10.0

_Note: Major version 0 releases are for initial development, and backwards compatible changes may be introduced at any time._

## Features

- ([881759e](https://github.com/angular/protractor/commit/881759e77462dc8e1001eb77008668ae6dc552cd)) feat(timeouts): add a unique error message when waitForAngular times out

To improve the readability of error messages, when waitForAngular times out
it now produces a custom message. This should help clarify confusion
for pages that continually poll using $interval. This change also adds more
documentation on timeouts. See issue #109.

- ([37e0f1a](https://github.com/angular/protractor/commit/37e0f1af196c3c0bf54dcddf0088a8c16602e5f2)) feat(install selenium): better communication in the install script

Adds better messages in the selenium server install script, and also
makes the script output a 'start' executable which can be used to quickly
start up the selenium standalone. *not yet windows friendly*. Closes #108.

- ([b32f5a5](https://github.com/angular/protractor/commit/b32f5a59169f1324271bd5abc09c17fcd9c4f249)) feat(config): add exmples for dealing with log-in

Adds examples for how to log in when the login page is not written
in Angular. New examples are in spec/login.

- ([1b7675a](https://github.com/angular/protractor/commit/1b7675aab7846bee54117876887bfec07ce31745)) feat(cli): add an onPrepare callback to the config

This onPrepare callback is useful when you want to do something with
protractor before running the specs. For example, you might want
to monkey-patch protractor with custom functions used by all the
specs, or add the protractor instance to the globals.
An example usage is shown in the spec/onPrepareConf.js file and its
associated spec.

## Bug fixes

- ([256b21c](https://github.com/angular/protractor/commit/256b21cf8c744a200892e6b7f9172150b2f4fe8d)) fix(cli): allow passing the config file before the options

The cli usage says:
> USAGE: protractor configFile [options]
However, the options passed as argument are merged into the default
configuration as soon as the configFile is met in the args parsing
loop.
This fix merges the options in the default configuration only after
the loop, allowing to pass the options to the cli before or after,
or around the config file.

- ([6223825](https://github.com/angular/protractor/commit/62238252c7fc68c6a5941883f6a272e95997a8ff)) fix(jasminewd): allow use of custom matchers

Using jasmine.Matchers.prototype to generate the chained methods for
expect() calls is flawed because it does not pick up custom matchers
defined using addMatcher.  Instead, use either the matchersClass for
the current spec or from the environment.

- ([c22fc38](https://github.com/angular/protractor/commit/c22fc387bc0ef7a07371e023d39a6ce58dfa56c9)) fix(sync): getCurrentUrl and friends should sync with Angular first

getCurrentUrl, getPageSource, and getTitle should sync with Angular
before executing. Closes #92.

- ([dd06756](https://github.com/angular/protractor/commit/dd067561cf9fe0a765e98605b9ebdd8fbfef04d3)) fix(clientsidescripts): findElements and isElementPresent for protractor.By.select

- ([c607459](https://github.com/angular/protractor/commit/c60745945c6514e25403783eab3de5873e15758b)) fix (navigation): The defer label should appear before other window names,
not after.

- ([806f381](https://github.com/angular/protractor/commit/806f38113c675a26171776a559a20bf3899aa2cc)) Fix: findElements() and isElementPresent() now work for protractor.By.input.
Closes #79.

## Breaking changes

- ([881759e](https://github.com/angular/protractor/commit/881759e77462dc8e1001eb77008668ae6dc552cd)) feat(timeouts): add a unique error message when waitForAngular times out

This changes the default script timeout from 100 seconds down to 11. Tests
which relied on extremely long timeouts will need to change the default script
timeout with `driver.manage().timeouts().setScriptTimeout(<bigNumber>)`.

# 0.9.0

_Note: Major version 0 releases are for initial development, and backwards compatible changes may be introduced at any time._

## Features

- ([0e8de99](https://github.com/angular/protractor/commit/0e8de99eb0d8a0db4f6d3538dd051c94f35775f5)) Wrap WebElements with Protractor specific features. This change allows
chained findElement calls to work with Protractor locators. It also
adds a function, evaluate, to evaluate an angular expression in the context
of a WebElement's scope.

- ([9f53118](https://github.com/angular/protractor/commit/9f5311812cbae5122ce2c6ebe522132273b0ebcc)) Improving the command line interface (adding more options). This allows
the --spec option to be passed with test files that will be resolved
relative to the current directory. Smarter merging of default config
values. Closes #65.

- ([73821fb](https://github.com/angular/protractor/commit/73821fb6b6d252a93cc15ce990b4ec4738b87b95)) Adding an 'ignoreSynchronization' property to turn off Protractor's attempt to
wait for Angular to be ready on a page. This can be used to test pages that
poll with $timeout or $http.

## Bug fixes

- ([cfc6438](https://github.com/angular/protractor/commit/cfc6438e80e77387afae776f289cd55813e9b2d9)) Adding support for isElementPresent with Protractor locators.
Closes #11.

- ([8329b01](https://github.com/angular/protractor/commit/8329b01865074c32f7a261fe9bbf2c151b704a34)) Adding waitForAngular calls before WebElement functions. Closes #37.

# 0.8.0

_Note: Major version 0 releases are for initial development, and backwards compatible changes may be introduced at any time._

## Docs
- Added documentation to the [docs folder](https://github.com/angular/protractor/tree/master/docs).

- ([08ef244](https://github.com/angular/protractor/commit/08ef244217fb83206c818c84cbe8f07999116ee3)) Adding debugging tests showing different types of timeouts, and fixing
a bug where scheduled tasks from a previous it block would run into
the next in case of a timeout.

## Features

- ([1c7eae0](https://github.com/angular/protractor/commit/1c7eae0c09f13b7068f81324f24967709e264241)) Updating the binary script to understand debug, so that
protractor debug conf.js works.

- ([7a59479](https://github.com/angular/protractor/commit/7a594791b5ac6616de9c98dcd7d44ecaffb0e8a3)) Adding a 'debug' function to protractor. This schedules a debugger pause
within the webdriver control flow.

- ([679c82d](https://github.com/angular/protractor/commit/679c82d510ea016690fba259db50b4afa36154cc)) Mixing in all webdriver exports to protractor. This means that webdriver
classes such as ActionSequence and Keys are accessible on the global
protractor.

- ([3c76246](https://github.com/angular/protractor/commit/3c76246a01e584bc30da645a36e75920b5397251)) Added nested angular app (ng-app on an element other than `<html>` or `<body>`) capability via conf file.

## Bug fixes

- ([1c9b98d](https://github.com/angular/protractor/commit/1c9b98d0464bbe57194cf340c6e5942cbe7c8385)) Fixed Sauce issues: low timeouts, shutdown and init order.

## Breaking Changes

- Now running selenium 2.25. Requires updating WebDriverJS and the selenium standalone binary and chromedriver binary.

- ([a54abfb](https://github.com/angular/protractor/commit/a54abfbbfd3b13be5144e64e52a267c73d409a81)) Spec paths in configuration files are now resolved from the location of the spec file instead of the current working directory when the command line is run.



# 0.7.0

_Note: Major version 0 releases are for initial development, and backwards compatible changes may be introduced at any time._

## Features

- ([7966912](https://github.com/angular/protractor/commit/796691205795d93fe12c998d20a58c8220ac6fb7)) Updating to Selenium 2.24.

- ([90f0a94](https://github.com/angular/protractor/commit/90f0a942b09faff5924674a20ce7705b6d685eba)) Instead of having tests run with the protractor runner need to require()
the protractor library, publish it to the global namespace. This insures
the instance of protractor used within the tests is the same as the
one used on the command line. Closes #36. Version bump for incompatible
API changes.

- ([cb373c9](https://github.com/angular/protractor/commit/cb373c99a7e33c5514bf1d2728a64f631ec8784c)) Adding glob matching to the spec files from the config. Closes #29.


## Breaking changes

- Now running on selenium 2.24. Requires updating WebDriverJS and the selenium standalone binary.

- The protractor runner now publishes `protractor` to the global namespace and sets up the Jasmine-WebDriver adapter. Tests run with this should no longer include

````javascript
// var protractor = require('protractor'); // No longer needed!
// require('protractor/jasminewd'); // No longer needed!

var ptor = protractor.getInstance(); // This should just work now.
````
