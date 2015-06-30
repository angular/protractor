Protractor Plugins
=================

Plugins extend Protractor's base features by using hooks during test
execution to gather more data and potentially modify the test output.

The Protractor API and available plugins are *BETA* and may change
without a major version bump.

The `plugins` folder contains default plugins for Protractor.

##In this document:
* [Using Plugins](/docs/plugins.md#using-plugins)
* [Writing Plugins](/docs/plugins.md#writing-plugins)
* Default Plugins
  * [Accessibility Plugin](/docs/plugins.md#accessibility-plugin)
  * [ngHint Plugin](/docs/plugins.md#nghint-plugin)
  * [Timeline Plugin](/docs/plugins.md#timeline-plugin)
  * [Console Plugin](/docs/plugins.md#console-plugin-chrome-only)

Using Plugins
-------------

Plugins are enabled via your config file.

```javascript
// protractor.conf.js
exports.config = {

  // ... the rest of your config

  plugins: [{
    // The only required field for each plugin is the path to that
    // plugin's entry script.
    // Paths are relative to location of the config file.
    path: 'path/to/plugin/index.js',

    // Plugins may use additional options specified here. See the
    // individual plugin docs for more information.
    option1: 'foo',
    option2: 'bar'
  }]
};
```

Protractor contains built in plugins in the 'plugins' folder. An example of
using the 'ngHint' plugin is shown below.

```javascript
  plugins: [{
    path: 'node_modules/protractor/plugins/ngHint',
  }]
```

If your plugin is a node module, you may use it with the `package` option. For
example, if you did `npm install example-protractor-plugin` your config would
look like:

```javascript
  plugins: [{
    package: 'example-protractor-plugin',
  }]
```

Finally, if you are writing a small plugin which will only be used by one config
file, you can write the plugin inline into the config:

```javascript
  plugins: [{
    inline: {
      setup: function() { ... },
      teardown: function() { ... },
      ...
    }
  }]
```

Writing Plugins
---------------

Plugins are designed to work with any test framework (Jasmine, Mocha, etc),
so they use generic hooks which Protractor provides. Plugins may change
the output of Protractor by returning a results object.

Plugins are node modules which export an object with the following API:

```js
/**
 * Sets up plugins before tests are run. This is called after the WebDriver
 * session has been started, but before the test framework has been set up.
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, a failed assertion is added to the test results.
 */
exports.setup = function() {};

/**
 * This is called after the tests have been run, but before the WebDriver
 * session has been terminated.
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, a failed assertion is added to the test results.
 */
exports.teardown = function() {};

/**
 * Called after the test results have been finalized and any jobs have been
 * updated (if applicable).
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, it is outputted to the console
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, an error is logged to the console.
 */
exports.postResults = function() {};

/**
 * Called after each test block (in Jasmine, this means an `it` block)
 * completes.
 *
 * @param {boolean} passed True if the test passed.
 * @param {Object} testInfo information about the test which just ran.
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before outputting test results.  Protractor
 *     will *not* wait before executing the next test, however.  If the promise
 *     is rejected, a failed assertion is added to the test results.
 */
exports.postTest = function(passed, testInfo) {};

/**
 * This is called inside browser.get() directly after the page loads, and before
 * angular bootstraps.
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, a failed assertion is added to the test results.
 */
exports.onPageLoad = function() {};

/**
 * This is called inside browser.get() directly after angular is done
 * bootstrapping/synchronizing.  If browser.ignoreSynchronization is true, this
 * will not be called.
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, a failed assertion is added to the test results.
 */
exports.onPageStable = function() {};

/**
 * Between every webdriver action, Protractor calls browser.waitForAngular() to
 * make sure that Angular has no outstanding $http or $timeout calls.
 * You can use waitForPromise() to have Protractor additionally wait for your
 * custom promise to be resolved inside of browser.waitForAngular().
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, a failed assertion is added to the test results, and protractor
 *     will continue onto the next command.  If nothing is returned or something
 *     other than a promise is returned, protractor will continue onto the next
 *     command.
 */
exports.waitForPromise = function() {};

/**
 * Between every webdriver action, Protractor calls browser.waitForAngular() to
 * make sure that Angular has no outstanding $http or $timeout calls.
 * You can use waitForCondition() to have Protractor additionally wait for your
 * custom condition to be truthy.
 *
 * @this {Object} bound to module.exports
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {q.Promise<boolean>|boolean} If truthy, Protractor will continue onto
 *     the next command.  If falsy, webdriver will continuously re-run this
 *     function until it is truthy.  If a rejected promise is returned, a failed
 *     assertion is added to the test results, and protractor will continue onto
 *     the next command.
 */
exports.waitForCondition = function() {};

/**
 * Used when reporting results.
 *
 * If you do not specify this property, it will be filled in with something
 * reasonable (e.g. the plugin's path)
 *
 * @type {string}
 */
exports.name = '';
```

Each of these exported properties are optional.

### Provided properties and functions

Extra properties are added to your `module.exports` when Protractor loads your
plugin.  These allow your plugin to do things like access its configuration
block or add test results.  They are as follows:

```js
/**
 * The plugin configuration object. Note that this is not the entire
 * Protractor config object, just the entry in the plugins array for this
 * plugin.
 *
 * @type {Object}
 */
exports.config;

/**
 * Adds a failed assertion to the test's results.
 *
 * @param {string} message The error message for the failed assertion
 * @param {specName: string, stackTrace: string} options Some optional extra
 *     information about the assertion:
 *       - specName The name of the spec which this assertion belongs to.
 *            Defaults to `PLUGIN_NAME + ' Plugin Tests'`.
 *       - stackTrace The stack trace for the failure.  Defaults to undefined.
 *     Defaults to `{}`.
 *
 * @throws {Error} Throws an error if called after results have been reported
 */
exports.addFailure(message, options);

/**
 * Adds a passed assertion to the test's results.
 *
 * @param {specName: string} options Extra information about the assertion:
 *       - specName The name of the spec which this assertion belongs to.
 *            Defaults to `PLUGIN_NAME + ' Plugin Tests'`.
 *     Defaults to `{}`.
 *
 * @throws {Error} Throws an error if called after results have been reported
 */
exports.addSuccess(options);

/**
 * Warns the user that something is problematic.
 *
 * @param {string} message The message to warn the user about
 * @param {specName: string} options Extra information about the assertion:
 *       - specName The name of the spec which this assertion belongs to.
 *            Defaults to `PLUGIN_NAME + ' Plugin Tests'`.
 *     Defaults to `{}`.
 */
exports.addWarning(message, options);
```

If you specify any of these properties in your plugin file, they will be
overwritten.

Accessibility Plugin
--------------------
Protractor comes with support for two accessibility testing options:
 * Accessibility Developer Tools
 * Tenon.io

Protractor will run each set of audits (depending on your configuration) on your existing end-to-end
tests to ensure your site is free of obvious errors. In this kind of testing, there is no concept of
"warnings"–only pass or fail. In your configuration, you can decide whether warnings should
pass or fail your build.

To understand how each of these tools can be used, see this support matrix:

| Testing Library                      | Pricing                                   | API Key | External Request | No. of Tests | Info                                                                    |
|--------------------------------------|-------------------------------------------|---------|------------------|--------------|-------------------------------------------------------------------------|
| Chrome Accessibility Developer Tools | Free                                      | No      | No               | 14           | [Github](https://github.com/GoogleChrome/accessibility-developer-tools) |
| Tenon.io                             | Free limited accounts, paid subscriptions | Yes     | Yes              | 63           | [Tenon.io](http://tenon.io/)                                            |

Protractor now supports the [Accessibility Developer Tools](https://github.com/GoogleChrome/accessibility-developer-tools), the same audit library used by the [Chrome browser extension](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb?hl=en). Protractor
[runs an audit](https://github.com/GoogleChrome/accessibility-developer-tools/wiki/Audit-Rules)
locally by injecting the Dev Tools script into WebDriver pages, and it can diagnose issues including
missing labels, incorrect ARIA attributes and color contrast. This is a great starting point if
you can't send source code over the wire through an API.

[Tenon.io](http://www.tenon.io) has a more robust set of tests to help you find
accessibility issues, but it requires [registering](http://tenon.io/register.php) for an API key
and making an external request for each test, which may not work for everyone. Some people use
Tenon with introspection services like ngrok or localtunnel to securely
test local web servers. Protractor takes the [options you provide](http://tenon.io/documentation/understanding-request-parameters.php) in the plugin configuration and sends them
with the page source to the Tenon API. One limitation of this approach is that all scripts must be reachable from the page source as a string, for example, by using a CDN.
For projects with an MIT license, Tenon is free but with a limited
daily API limit. Paid subscriptions are available for enterprise and commercial projects.

Enable this plugin in your config file:
```js
  // Chrome Accessibility Dev Tools only:
  exports.config = {
      ...
      plugins: [{
        chromeA11YDevTools: {
          treatWarningsAsFailures: true
        },
        path: 'node_modules/protractor/plugins/accessibility'
      }]
    }
```
```js
  // Tenon.io only:
  exports.config = {
      ...
      plugins: [{
        tenonIO: {
          options: {
            // See http://tenon.io/documentation/understanding-request-parameters.php
            // options.src will be added by the test.
          },
          printAll: false, // whether the plugin should log API response
        },
        chromeA11YDevTools: true,
        path: 'node_modules/protractor/plugins/accessibility'
      }]
    }
```

ngHint Plugin
-------------
ngHint adds run-time hinting to AngularJS projects. This plugin bubbles those hints up to the
command line so they can be used in automated testing.

You enable this plugin in your config file:
 ```js
exports.config = {
  plugins: [{
    path: 'node_modules/protractor/plugins/ngHint',

    asTests: {Boolean},
    excludeURLs: {(String|RegExp)[]}
  }]
};
```
`asTests` specifies if the plugin should generate passed/failed test results
based on the ngHint output or instead log the results to the console.
Defaults to true.

`excludeURLs` specifies a list of URLs for which ngHint results should be
ignored. Defaults to []

Timeline Plugin
---------------
This plugin gathers test timeline information from the protractor test process, the selenium
client logs (if available), and sauce labs (if available), and presents the output visually.
This improves understanding of where latency issues are in tests.

To enable the Timeline plugin, set it up in your config file:
```js
exports.config = {
  plugins: [{
   path: 'node_modules/protractor/plugins/timeline/index.js',

    // Output json and html will go in this folder.
   outdir: 'timelines',

    // Optional - if sauceUser and sauceKey are specified, logs from
   // SauceLabs will also be parsed after test invocation.
     sauceUser: 'Jane',
     sauceKey: 'abcdefg'
   }],
  // other configuration settings
};
```


Console Plugin (Chrome only)
----------------------------

This plugin checks the browser log after each test for warnings and errors.  It
can be configured to fail a test if either is detected.  There is also an
optional exclude parameter which accepts both regex and strings.  Any log
matching the exclude parameter will not fail the test or be logged to the
console.

```js
exports.config = {
  plugins: [{
    path: 'node_modules/protractor/plugins/console',
    failOnWarning: {Boolean}                (Default - false),
    failOnError: {Boolean}                  (Default - true)
    exclude: {Array of strings and regex}   (Default - [])
  }]
};
```

Note that this plugin's behavior is undefined on browsers other than Chrome.
Firefox users have reported flaky results.
