Protractor Plugins
=================

Plugins extend Protractor's base features by using hooks during test
execution to gather more data and potentially modify the test output.

The Protractor API and available plugins are *BETA* and may change
without a major version bump.

This folder contains default plugins for Protractor.

Using Plugins
-------------

Plugins are enabled via your config file.

```javascript
// protractor.conf.js
exports.config = {

  // ... the rest of your config

  plugins[{
    // The only required field for each plugin is the path to that
    // plugin's entry script.
    path: 'path/to/plugin/index.js',

    // Plugins may use additional options specified here. See the 
    // individual plugin docs for more information.
    option1: 'foo',
    option2: 'bar'
  }]
};
```

Writing Plugins
---------------

Plugins are node modules which export an object with the following API:

```js
/*
 * Sets up plugins before tests are run. This is called after the WebDriver
 * session has been started, but before the test framework has been set up.
 *
 * @param {Object} config The plugin configuration object. Note that
 *     this is not the entire Protractor config object, just the
 *     entry in the plugins array for this plugin.
 *
 * @return Object If an object is returned, it is merged with the Protractor
 *     result object. May return a promise.
 */
exports.setup = function(config) {};

/*
 * This is called after the tests have been run, but before the WebDriver
 * session has been terminated.
 *
 * @param {Object} config The plugin configuration object.
 *
 * @return Object If an object is returned, it is merged with the Protractor
 *     result object. May return a promise.
 */
exports.teardown = function(config) {};

/*
 * Called after the test results have been finalized and any jobs have been
 * updated (if applicable).
 *
 * @param {Object} config The plugin configuration object.
 *
 * @return Return values are ignored.
 */
exports.postResults = function(config) {};
```

The protractor results object follows the format specified in
the [Framework documentation](../lib/frameworks/README.md).
