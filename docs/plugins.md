Protractor Plugins
=================

Plugins extend Protractor's base features by using hooks during test
execution to gather more data and potentially modify the test output.

The Protractor API and available plugins are *BETA* and may change
without a major version bump.

##In this document:
* [Using Plugins](/docs/plugins.md#using-plugins)
* [Writing Plugins](/docs/plugins.md#writing-plugins)
* [First Party Plugins](/docs/plugins.md#first-party-plugins)
* [Community Plugins](/docs/plugins.md#community-plugins)

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

An example of using the 'ngHint' plugin is shown below.

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
 * This is called before the test have been run but after the test framework has
 * been set up.  Analogous to a config file's `onPreare`.
 *
 * Very similar to using `setup`, but allows you to access framework-specific
 * variables/funtions (e.g. `jasmine.getEnv().addReporter()`)
 *
 * @throws {*} If this function throws an error, a failed assertion is added to
 *     the test results.
 *
 * @return {Q.Promise=} Can return a promise, in which case protractor will wait
 *     for the promise to resolve before continuing.  If the promise is
 *     rejected, a failed assertion is added to the test results.
 */
exports.onPrepare = function() {};

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


/**
 * Used to turn off default checks for angular stability
 *
 * Normally Protractor waits for all $timeout and $http calls to be processed
 * before executing the next command.  This can be disabled using
 * browser.ignoreSynchronization, but that will also disable any
 * <Plugin>.waitForPromise or <Plugin>.waitForCondition checks.  If you want to
 * disable synchronization with angular, but leave in tact any custom plugin
 * synchronization, this is the option for you.
 *
 * This is used by users who want to replace Protractor's synchronization code
 * with their own.
 *
 * @type {boolean}
 */
exports.skipAngularStability
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

### Writing Plugins in TypeScript

The simplest way to write plugins in TypeScript is to mirror the javascript
syntax:

```typescript
export function onPageLoad(): void {
  this.addSuccess({specName: 'Hello, World!'});
};
```

If you want your code more heavily typed, you can write your plugin with
the `ProtractorPlugin` interface:

```typescript
import {ProtractorPlugin} from 'protractor';

// creating a "var module: any" will allow use of module.exports
declare var module: any;

let myPlugin: ProtractorPlugin = {
  addSuccess(info: {specName: string}) {
    console.log('on success: ' + info.specName);
  },
  onPageLoad() {
    this.addSuccess({specName: 'Hello, World!'});
  }
};

module.exports = myPlugin;

```


First Party Plugins
-------------------

* Accessibility Plugin

  The accessibility plugin runs a set of accessibility audits on your webapp.
  It is published at the npm module [`protractor-accessibility-plugin`]
  (https://www.npmjs.com/package/protractor-accessibility-plugin) and stored at
  the github repo [angular/protractor-accessibility-plugin]
  (https://github.com/angular/protractor-accessibility-plugin).

* Timeline Plugin

  The timeline plugin gathers test timeline information from various sources and
  presents the output visually.  This improves understanding of where latency
  issues are in tests.  It is published at the npm module
  [`protractor-timeline-plugin`]
  (https://www.npmjs.com/package/protractor-timeline-plugin) and stored at the
  github repo [angular/protractor-timeline-plugin]
  (https://github.com/angular/protractor-timeline-plugin).

* ngHint Plugin

  The ngHint plugin uses [Angular Hint](https://github.com/angular/angular-hint)
  to generate run-time hinting and then turns these hints into Protractor tests.
  It is published at the npm module [`protractor-ng-hint-plugin`]
  (https://www.npmjs.com/package/protractor-ng-hint-plugin) and stored at the
  github repo [angular/protractor-ng-hint-plugin]
  (https://github.com/angular/protractor-ng-hint-plugin).

* Console Plugin (Chrome Only)

  The console plugin checks the browser log after each test for warnings and
  errors.  It is published at the npm module [`protractor-console-plugin`]
  (https://www.npmjs.com/package/protractor-console-plugin) and stored at the
  github repo [angular/protractor-console-plugin]
  (https://github.com/angular/protractor-console-plugin).

Community Plugins
-----------------

This list is here for reference and the plugins included are not developed or
mantained by protractor's team by any means. If you find any issues with this
plugins please report them to the corresponding plugin developer.

* [Protractor testability plugin](https://github.com/alfonso-presa/protractor-testability-plugin): this plugins enables synchronous testing with protractor for features that are not developed using the services provided by AngularJS, preventing the need of additional waits coded in the tests. This happens for example if you have WebSockets communication with the server or for web applications built with frameworks different than AngularJS.
