Framework Adapters for Protractor
=================================

Protractor can work with any test framework that is adapted here.

Each file details the adapter for one test framework. Each file must export a `run` function with the interface:

```js
/**
 * @param {Runner} runner The Protractor runner instance.
 * @param {Array.<string>} specs A list of absolute filenames.
 * @return {q.Promise} Promise resolved with the test results
 */
exports.run = function(runner, specs)
```

Requirements
------------

 - `runner.emit` must be called with `testPass` and `testFail` messages.

 - `runner.runTestPreparer` must be called before any tests are run.

 - `runner.getConfig().onComplete` must be called when tests are finished.

 - The returned promise must be resolved when tests are finished and it should return a results object.
 This object must have a `failedCount` property.
