Framework Adapters for Protractor
=================================

Protractor can work with any test framework that is adapted here.

Each file details the adapter for one test framework. Each file must export a
`run` function with the interface:

```ts
/**
 * @param {Runner} runner The Protractor runner instance.
 * @param {Array.<string>} specs A list of absolute filenames.
 * @return {Promise.<Object>} Promise resolved with the test results.  See
 *   "Requirements" section for details.
 */
export let run: (runner: Protractor.Runner, specs: string[]) => Promise<Object>
```

Requirements
------------

- `runner.emit` must be called with `testPass` and `testFail` messages. These
  messages must be passed a `testInfo` object with the following structure:

  ```ts
  testInfo: {
    category: string,
    name: string
  }
  ```

  The `category` property could be the name of the `describe` block in
  jasmine/mocha, the `Feature` in cucumber, or the class name in something like
  jUnit.
  The `name` property could be the name of an `it` block in jasmine/mocha, the
  `Scenario` in cucumber, or the method name in something like jUnit.

- `runner.runTestPreparer` must be called after the framework has been
  initialized but before any spec files are run.  This function returns a
  promise which should be waited on before executing tests. The framework should
  also pass an array of extra command line flags it accepts, if any.

- `runner.getConfig().onComplete` must be called when tests are finished.
  It might return a promise, in which case `exports.run`'s promise should not
  resolve until after `onComplete`'s promise resolves.

- The returned promise must be resolved when tests are finished and it should
  return a results object. This object must have a `failedCount` property and
  optionally a `specResults` object of the following structure:

  ```ts
  specResults: [{
    description: string,
    assertions: [{
      passed: boolean,
      errorMsg: string,
      stackTrace: string
    }],
    duration: integer
  }]
  ```

### Future requirements

In Protractor 6.0, the following additional requirement will be added:

- `runner.afterEach` will have to be called after each test finishes.  It will
  return a promise, which should be waited for before moving onto the next test.

If you want your framework to be backwards-compatible, you can simply write:

```ts
if (runner.afterEach) {
  // Add afterEach caller
}
```

Failing to call `runner.afterEach` will cause features like
`restartBrowserBetweenTests` to fail.  Protractor may also log a warning to the
console. 

Custom Frameworks
-----------------

If you have created/adapted a custom framework and want it added to
Protractor core please send a PR so it can evaluated for addition as an
official supported framework. In the meantime you can instruct Protractor
to use your own framework via the config file:

```ts
export let config: Protractor.Config = {
  // set to "custom" instead of jasmine/mocha
  framework: 'custom',
  // path relative to the current config file
  frameworkPath: './frameworks/my_custom_jasmine.js',
};
```

More on this at the [configuration](../config.ts).

**Disclaimer**: current framework interface can change without a major version bump.
