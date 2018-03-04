Protractor Plugins
=================

Plugins extend Protractor's base features by using hooks during test
execution to gather more data and potentially modify the test output.

The Protractor API and available plugins are *BETA* and may change
without a major version bump.

## Table of contents
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

If your plugin is a node module, you may use it with the `package` option. For
example, if you did `npm install example-protractor-plugin` your config would
look like:

```javascript
  plugins: [{
    package: 'example-protractor-plugin',
  }]
```

If you are writing a small plugin which will only be used by one config file,
you can write the plugin inline into the config:

```javascript
  plugins: [{
    inline: {
      setup: function() { ... },
      teardown: function() { ... },
      ...
    }
  }]
```

When using plugins, you should specify exactly one of `path`, `package`, or
`inline`.

Writing Plugins
---------------

Plugins are designed to work with any test framework (Jasmine, Mocha, etc),
so they use generic hooks which Protractor provides. Plugins may change
the output of Protractor by returning a results object.

Plugins are node modules that export an object implementing the
`ProtractorPlugin` interface.  Please see [`/lib/plugins.ts`](
/lib/plugins.ts#L25) for a list of hooks that are available to plugins.

##### Provided properties and functions

Extra properties are added to your `module.exports` when Protractor loads your
plugin.  These allow your plugin to do things like access its configuration
block or add test results.  See `/lib/plugins.ts` for the full list.

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
  It is published at the npm module [`protractor-accessibility-plugin`](https://www.npmjs.com/package/protractor-accessibility-plugin) and stored at
  the github repo [angular/protractor-accessibility-plugin](https://github.com/angular/protractor-accessibility-plugin).

* Timeline Plugin

  The timeline plugin gathers test timeline information from various sources and
  presents the output visually.  This improves understanding of where latency
  issues are in tests.  It is published at the npm module
  [`protractor-timeline-plugin`](https://www.npmjs.com/package/protractor-timeline-plugin) and stored at the
  github repo [angular/protractor-timeline-plugin](https://github.com/angular/protractor-timeline-plugin).

* Console Plugin (Chrome Only)

  The console plugin checks the browser log after each test for warnings and
  errors.  It is published at the npm module [`protractor-console-plugin`](https://www.npmjs.com/package/protractor-console-plugin) and stored at the
  github repo [angular/protractor-console-plugin](https://github.com/angular/protractor-console-plugin).

* ngHint Plugin (NOT MAINTAINED)

  The ngHint plugin uses [Angular Hint](https://github.com/angular/angular-hint)
  to generate run-time hinting and then turns these hints into Protractor tests.
  It is published at the npm module [`protractor-ng-hint-plugin`](https://www.npmjs.com/package/protractor-ng-hint-plugin) and stored at the
  github repo [angular/protractor-ng-hint-plugin](https://github.com/angular/protractor-ng-hint-plugin).

Community Plugins
-----------------

This list is here for reference and the plugins included are not developed or
mantained by protractor's team by any means. If you find any issues with this
plugins please report them to the corresponding plugin developer.

* [Protractor testability plugin](https://github.com/alfonso-presa/protractor-testability-plugin): this plugin enables synchronous testing with protractor for features that are not developed using the services provided by AngularJS, preventing the need of additional waits coded in the tests. This happens for example if you have WebSockets communication with the server or for web applications built with frameworks different than AngularJS.

* [protractor-fail-fast](https://github.com/Updater/protractor-fail-fast): Allows Protractor to "fail-fast", forcing all test runners to exit if one of them encounters a failing test. For scenarios where a failure means the entire build has failed (e.g. CI), failing fast can save a tremendous amount of time.

* [protractor-numerator](https://github.com/Marketionist/protractor-numerator): This plugin gives you readable functions for getting elements by their numbers inside Protractor tests. Adds functions like `.second()`, `.third()`, etc. instead of `.get(1)`, `.get(2)`, etc.

* [Ng-apimock](https://github.com/mdasberg/ng-apimock): this plugin adds the ability to use scenario based api mocking for local development and protractor testing for both AngularJS and Angular applications.

* [protractor-cucumber-steps](https://github.com/Marketionist/protractor-cucumber-steps): This plugin provides Cucumber steps (step definitions) written with Protractor for end-to-end tests.
