# Building and Testing Protractor

This document describes building, testing, releasing Protractor and provides an overview of
the repository layout.

## Prerequisite software

The prerequisite software (Node.js, npm, git, jdk) are the same as for angular. See
https://github.com/angular/angular/blob/master/DEVELOPER.md#prerequisite-software

## Getting the sources

Fork Protractor from github, then clone your fork with:

```shell
git clone git@github.com:<github username>/protractor.git

# Go to the Protractor directory:
cd protractor/

# Add the main protractor repository as an upstream remote to your repository:
git remote add upstream https://github.com/angular/protractor.git
```

## Installing and Building

All Protractor dependencies come from npm. Install with:

```shell
npm install
```

This will also trigger our build step. The build step runs the TypeScript compiler
and copies necessary files into the output `built` directory. To run the build step
independently, run:

```shell
npm run prepublish
```

You can see the other available npm scripts in `package.json`. Note that most of these
scripts just call our `gulp` commands, which can be seen in `gulpfile.js`.

## Formatting

Protractor uses clang-format to format the source code. If the source code is not properly formatted,
the CI will fail and the PR can not be merged.

You can automatically format your code by running:

```shell
npm run format
```

You can check that you will pass lint tests with:

```shell
gulp lint

# or if you don't have gulp installed globally:
./node_modules/.bin/gulp lint
```

## Code layout

`docs/` contains markdown documentation files.
`lib/` contains the actual Protractor code.
`scripts/` contains scripts used for CI setup and running tests.
`spec/` contains e2e and unit tests and configuration files for tests.
`testapp/` contains the code for the Angular applications that e2e tests run against.
`website/` contains code for generating Protractor API documentation and the website at protractortest.org.

Most of the code is written in TypeScript, with the exception of a few js files.

`lib/debugger` is for element explorer, `browser.pause` and `browser.explore`.
`lib/driverProviders` controls how WebDriver instances are created.
`lib/frameworks` contains adapters for test frameworks such as Jasmine and Mocha.
`lib/selenium-webdriver` and `lib/webdriver-js-extender` are used ONLY for API documentation generation.

## Lightning Code Walkthrough

TBD.

## Testing

Run `npm test` to run the full test suite. This assumes that you have the testapp and a
selenium server running. Start these as separate processes with:

```shell
webdriver-manager update
webdriver-manager start
```

and

```shell
npm start
```

This suite is described in `scripts/test.js`. It uses some small helper functions to run commands
as child processes and capture the results, so that we can run protractor commands which should
result in failures and verify that we get the expected number and type of failures.

The suite contains unit tests, end to end tests using the built binary, and interactive tests.
Interactive tests are for testing `browser.pause` and element explorer.

End to end tests all have configuration files which live in `spec/`. Many tests do not need
an actual Selenium server backing them and use the `mockSelenium` configuration, which saves
time by not connecting to a real selenium server.

## Important dependencies

Protractor has very close dependencies with several other projects under the Angular umbrella:

`jasminewd2` is an extension of the Jasmine test framework that adds utilities for
working with selenium-webdriver. [jasminewd](https://github.com/angular/jasminewd)

`blocking-proxy` is a separate binary, which handles traffic between a test script and
webdriver. It can be turned on via a protractor configuration file, and in the future
all logic to wait for Angular will be handled through the blocking proxy.
[blocking-proxy](https://github.com/angular/blocking-proxy)

`webdriver-manager` is a separate binary which manages installing and starting up
the various binaries necessary for running webdriver tests. These binaries include
specific drivers for various browsers (e.g. chromedriver) and the selenium standalone
server. [webdriver-manager](https://github.com/angular/webdriver-manager)

`webdriver-js-extender` extends selenium-webdriver to add Appium commands.
[webdriver-js-extender](https://github.com/angular/webdriver-js-extender)

## Continuous Integration

PRs or changes submitted to master will automatically trigger continuous integration on two
different services - Travis, and Circle CI. We use Travis for tests run with SauceLabs because
we have more vm time on Travis and their integration with SauceLabs is smooth. CircleCI gives us
greater control over the vm, which allows us to run tests against local browsers and get better
logs.

Travis runs e2e tests via SauceLabs against a variety of browsers. The essential browsers run a
more complete test suite, `specified by spec/ciFullConf.js`. We also run a set of smoke tests
against a larger set of browsers, which is allowed to fail - this is configured in
`spec/ciSmokeConf.js`. This is due to flakiness in IE, Safari and older browser versions.
We also run a small set of tests using BrowserStack to verify that our integration with their
Selenium farm works.

Circle CI runs a slightly modified version of `npm test` in a single VM. It installs
the browsers it needs locally. Circle CI runs unit tests and a set of e2e tests against Chrome.

## Releasing

See `release.md` for full instructions.
