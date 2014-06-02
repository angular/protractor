Framework Adapters for Protractor
=================================

Protractor can work with any test framework that is adapted here.

Each file details the adapter for one test framework. Each file must export a `run` function with the interface:

```js
/**
 * @param {Runner} runner The Protractor runner instance.
 * @param {Array.<string>} specs A list of absolute filenames.
 * @param {Function} done A callback for when tests are finished.
 */
exports.run = function(runner, specs, done)
```

Requirements
------------

 - `runner.emit` must be called with `testPass` and `testFail` messages.

 - `runner.runTestPreparers` must be called before any tests are run.

 - `runner.getConfig().onComplete` must be called when tests are finished.

 - When finished, `done` must be invoked and passed a results object. This object must have a `failedCount` property.
