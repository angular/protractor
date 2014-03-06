# 0.20.1
_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Bug Fixes
- ([17de697](https://github.com/angular/protractor/commit/17de697fe9f64e238a8df0fbc6358b8e578e45f2
  fix(debug): make new debug work on windows too

  Closes #580

# 0.20.0
_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([220d793](https://github.com/angular/protractor/commit/220d79372fb93d3b58c5131188b24e48be8176ab)), ([6603a7e](https://github.com/angular/protractor/commit/6603a7e964c8f1632db4790081a71648360cf1f9)) 
  chore(webdriver): update selenium version to 2.40.0 and download location

- ([ad5f3aa](https://github.com/angular/protractor/commit/ad5f3aa77fc3429fcf83f825a14fdb43fd7cc8a7)) 
  feat(jasminewd): allow custom matchers to return promises

  Allow custom jasmine matchers to return a promise which resolves to a boolean and match against
  the resolution of the promise

- ([41feaca](https://github.com/angular/protractor/commit/41feaca58c81fbd578c77424abf745acaf26f84f)) 
  feat(framework.cucumber): Allow multiple tags on cucumber tests.

  Motivation: Support for multiple tags on the cucumber test execution, to be able to filter with
  more complex expressions the scenarios to run.

  How to use:
  ```
  cucumberOpts: {
     tags: '@dev'
  }
  ```

  or

  ```
  cucumberOpts: {
     tags: ['@dev', '~@ignore']
  }
  ```

  More information on tags: https://github.com/cucumber/cucumber/wiki/Tags

## Bug Fixes

- ([2ca6541](https://github.com/angular/protractor/commit/2ca654114a2bf937313ff027583308f87e909892)) 
  fix(debug): make protractor debug work in the new runner/launcher world

  Closes #552

- ([a68627b](https://github.com/angular/protractor/commit/a68627b3581c0551e04460682cfc13f8f91be366)) 
  fix(launcher): command line args should be passed as-is to the runner

  This allows users to continue to use optimist (or other process.argv) processing within their
  tests and grab values from the command line.

  Closes #571.

- ([767c306](https://github.com/angular/protractor/commit/767c306102956ba6015cfe3998affb7e8430f259)), ([02defe3](https://github.com/angular/protractor/commit/02defe360dce41ee6841df9012166d249acfeca0)) 
  fix(jasminewd): include full pre-async-call stack trace in expectation failure message

- ([b6df2cf](https://github.com/angular/protractor/commit/b6df2cfcfd35b31e2e473604b6df9add744c6c2d)) 
  fix(configParser): load coffee and typescript for child processes

  Without loading coffee in configParser.js, child processes which try and load a coffeescript
  config file do not have coffee registered with node's required, and child tests fail.

  Fixes an issue with using coffeescript config files.

- ([64bee25](https://github.com/angular/protractor/commit/64bee252f6df52f9243c0f5d7e40f39bf5407134)) 
  fix(locators): add locator with multiple arguments

  When using a custom locator with multiple arguments, only the first argument was used when 
  calling `webdriver.findElements`.


- ([87b0c7f](https://github.com/angular/protractor/commit/87b0c7f2ecc8befa4fa1ebd5d8238c811a869aff)) 
  fix(debug): display error message when runner fails

# 0.19.0
_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features
- ([77393d0](https://github.com/angular/protractor/commit/77393d08343ef16ddc2b8042e187c9d68fe7bf2f)), ([6848180](https://github.com/angular/protractor/commit/68481801d506941ebf00fab71f87be510c7a87ba)), ([cca82ca](https://github.com/angular/protractor/commit/cca82caab6ae444b368eebe040a69967d774737e))
  feat(runner/launcher): major runner updates to allow multiple capabilities

  Adding simultaneous runner capability (grid-style), refactoring launch/runner init system, and
  abstracting out configParser module.

- ([642de06](https://github.com/angular/protractor/commit/642de06e8bbabf82c7b8e0a64a280df5c4daf01c)) 
  feat(protractor): add removeMockModule method

- ([88c339f](https://github.com/angular/protractor/commit/88c339fc1d392717a0a5b8265806934b40158c5f)) 
  feat(runner): add adapter for cucumber.js

  Conflicts:
  lib/runner.js

## Bug Fixes
- ([8924bbc](https://github.com/angular/protractor/commit/8924bbca9e8f04073a29534bf16b0867a1ede7a0)) 
  fix(cli): convert capabilities arguments to dot-notation for WebDriver compatibility

- ([a96d32f](https://github.com/angular/protractor/commit/a96d32f44a92ba9447fc843bc0aca7b91b777635)) 
  fix(webdriver-manager): upcase in IE download url

  The url for the Win32 version of the IEDriverServer is apparently case sensitive: _win32_ vs
  _Win32_

## Breaking Changes
- ([05eb42b](https://github.com/angular/protractor/commit/05eb42bb482c7cb36b48af1a86210afc442aa112)) 
  refactor(locators): moves scope in locators to last argument

  scope defaults to document, and is an optional argument so now be moved to the end. Came up from
  debugging and trying to use window.clientSideScripts.findInputs('username'); which failed.
  Refactored to match original intent.

  BREAKING CHANGE: anything relying on clientsidescripts should no longer pass
     element scope as first argument.

      Before:

      window.clientSideScripts.findInputs(document, 'username');

      After:

      window.clientSideScripts.findInputs('username', document);
      // or simply
      window.clientSideScripts.findInputs('username');

    Also, any custom locators using addLocator will now break since the
    arguments order has chnaged. To migrate the code follow the example below:

      Before:

      var findMenuItem = function() {
        var domScope = arguments[0];
        var myArg = arguments[1];
        // balh blah blah
      };
      by.addLocator('menuItem', findMenuItem);

      After:

      var findMenuItem = function() {
        var myArg = arguments[0];
        var domScope = arguments[1];
        // balh blah blah
      };
      by.addLocator('menuItem', findMenuItem);

  Closes #497


# 0.18.1
_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Bug Fixes

- ([a79aa73](https://github.com/angular/protractor/commit/a79aa73df5df598ccad695af882d23ddaac2c2d9))
  fix(cli): specs was being processed as a string, not a list

  Fixes #495

# 0.18.0
_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([e3b1e7c](https://github.com/angular/protractor/commit/e3b1e7cec7af35f2e245ca64e4f94227ecaa1c57)) 
  feat(config): add option to exclude specs based on file patterns

  The config now accepts `exclude`, an array of patterns to exclude.

- ([88a1e58](https://github.com/angular/protractor/commit/88a1e587a40f0e6d978b20fe55160a18e2855493)) 
  Feat(clientSideScripts): Add by.buttonText, by.partialButtonText

  Adds client side JS implementations of by.buttonText and by.partialButtonText, enabling element
  lookup based on innerText.

  Closes #452

- ([8d29c93](https://github.com/angular/protractor/commit/8d29c939766f044d910401e60834769cf8e5e44b)) 
  feat(config): allow LiveScript configuration files

## Bug Fixes

- ([d06d931](https://github.com/angular/protractor/commit/d06d931e1cb2c2bd38c2c50965a6f78690bdc336)) 
  fix(timeouts): fix an obscure cause of firefox timeouts

  Fixes #493

- ([de39e50](https://github.com/angular/protractor/commit/de39e5077d09daaeb885767e968a5cef78c9cac7)) 
  fix(jasminewd): support multi-argument matchers

  Implement support for multi-argument matchers in promise wrapper.

  Closes #477

- ([11c4210](https://github.com/angular/protractor/commit/11c4210fe740771707d5421a4940bdce43d3d33e)) 
  fix(testForAngular): add a message when page load does not complete in time

- ([6ae6261](https://github.com/angular/protractor/commit/6ae626158ee0610b70501af5d57ad4ff379c5ead)) 
  refactor(waitForAngular): improve error messages when timeouts occur

- ([5dd93c2](https://github.com/angular/protractor/commit/5dd93c2397a401011e16271f6472c72037c871b6)) 
  fix(config): allow CoffeeScript 1.7 to be used

  CoffeeScript now requires a register call to be made.

- ([10aec0f](https://github.com/angular/protractor/commit/10aec0ff212987bfdb9ab4011e6cb2f9c646fca2)) 
  fix(pageload): increase wait timeout

  The 300 ms wait caused problems when testing IE on Sauce Labs. It seems way too short.
  "browser.get()" invariably timed out. Increasing it solved our problem.


# 0.17.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([cc4f7b5](https://github.com/angular/protractor/commit/cc4f7b55e1fe46fcef1b8c3ca39d702a32ee6d82)), ([8348803](https://github.com/angular/protractor/commit/834880368115ecade154b3a090e06159667c0c2d)) 
  feat(element): allow chaining of element finders with element().element()...

  Chaining calls to element will now build a scoped element finder. No webdriver functions will be
  called until a method (such as getText) is called on the final element. Example:

      var elem = element(by.id('outer')).element(by.css('inner'));
     browser.get('myPage');
     elem.click();

  Closes #340.

- ([088a581](https://github.com/angular/protractor/commit/088a58150f992a6520da983fc461fec4eac1a0ed)) 
  feat(runner): add a callback for when the tests are done

  Add an onCleanUp callback to be able to hook into when all the tests have been run.

  Conflicts:
  referenceConf.js

- ([66c4774](https://github.com/angular/protractor/commit/66c4774aa18d94d4da81c101b82db4a748cf69a4)) 
  feat(runner): add mocha options to config file

  change lib/runner to allow setting mocha options from config.

- ([092fe1f](https://github.com/angular/protractor/commit/092fe1fc1e7d1b58b786870ff1ce33f95e652d78)), ([3151ca7](https://github.com/angular/protractor/commit/3151ca7daaeeec9f537561b31c6dfd42c678f7bb)) 
  feat(locators): Add map() function to element.all

  Added a map function to element.all to apply a function to each element and return the result of
  the transformation.

  Resolve promises if there is an object that contains multiple promises. Added index as a second
  argument to the map function callback.

  Closes #392

- ([7259614](https://github.com/angular/protractor/commit/7259614a326802b8e7a906346bd9830b92e1514d)), ([0257b5f](https://github.com/angular/protractor/commit/0257b5f225052ab0a075d96811dd56961f9278ae)) 
  feat(config): allow CoffeeScript configuration files

  Require CoffeeScript in the cli file to enable CS configuration and spec files.

  Possibly fixes #38

- ([e7d9e08](https://github.com/angular/protractor/commit/e7d9e081cdc7fcf100e0346b1dcf0f7fdad7d889)) 
  feat(global): export By (== by) on the global for use with coffeescript (or others who prefer it)

## Bug Fixes

- ([a0bd84b](https://github.com/angular/protractor/commit/a0bd84b9a28ec92eccd2784f8b849388985a4480)) 
  fix(pageload): add a wait during protractor.get() to solve unload issues

  Some systems would not wait for the browser unload event to finish before beginning the
  asynchronous script execution.

  Closes #406. Closes #85.

- ([4b053eb](https://github.com/angular/protractor/commit/4b053ebe587d51562d77ca512848be28195ae0cc)) 
  fix(runner): only run selenium with spec files

  Only setup Selenium if there are actual spec files passed in

- ([8e096b9](https://github.com/angular/protractor/commit/8e096b9a91af9c37ab4bf84e100568544351efc8)) 
  fix(Protractor.prototype.get): resolve `baseUrl` before ignoring synchronization

  Fixes issues where setting `ignoreSynchronization = true` ignores the value of `baseUrl`
  entirely.

# 0.16.1
_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

_Note: 0.16.0 was released as a canary - no changelog for it._

## Features

- ([a75fa04](https://github.com/angular/protractor/commit/a75fa04a70f64e0da29b9a0a9100bd60d9ebf93f)) 
  docs(readme): add the travis status widget

- ([478c00a](https://github.com/angular/protractor/commit/478c00a01dc9b93de68983b6ef2dfa55f0b42649)) 
  feat(runner): add beta support for using mocha as your test framework

  This change adds limited support for using mocha as the test framework instead of jasmine. Make
  the switch by using `--framework=mocha` on the command line or adding `framework: 'mocha'` to the
  config. Tests will be run using the BDD interface. The interface is adapted so that tests run
  asynchronously without needing to call `done()`.

  Note that there is currently no support for an assertion framework, so you will need to require
  whichever assertion framework you prefer. This means there is no adapter to make the assertions
  unwrap promises, so you will need to resolve promises yourself and run the assertions afterwards.

- ([3731abf](https://github.com/angular/protractor/commit/3731abf901c4278b4470336c3a58765161b08bcc)) 
  feat(webdriver-manager): add seleniumPort command line option

  Added seleniumPort command line option so that the standalone selenium server can be started with
  the supplied port number as opposed to the default port 4444.
  ```
  $ webdriver-manager start --seleniumPort 4443
  ```

## Bug Fixes

- ([bc18c42](https://github.com/angular/protractor/commit/bc18c42dab6207d111f88ea1f1deefb9bcc28f23)) 
  chore(config): saucelabs requires tunnel identifier to be a string

## Breaking Changes

 - ([478c00a](https://github.com/angular/protractor/commit/478c00a01dc9b93de68983b6ef2dfa55f0b42649)) 
  feat(runner): add beta support for using mocha as your test framework

  To allow the user to customize their framework, the protractor runner will now wait
  until just before `onPrepare` to load the framework. This means that `jasmine` will
  not be available in global until `onPrepare`. For example, this means that requiring
  the jasmine-reporters module must be done inside onPrepare, since that module expects
  jasmine to be available at the time it is loaded.


# 0.15.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([f8d0291](https://github.com/angular/protractor/commit/f8d02910340f54af92a8ed5fdd067fa03ca2cef8)) chore(version): update the version of dependency minijasminenode

  This is notable because in the newer 0.2.6 version of minijasminenode,
  ddescribe and iit are supported. These should be available after running
  an 'npm update'.

- ([6165023](https://github.com/angular/protractor/commit/6165023a9593f4f69fe342761b8b2d75923baf7a)) feat(runner): return a promise from runner.runOnce

  In some cases knowing when the runner has finished is a requirement (e.g. an async grunt task).

- ([d44ef01](https://github.com/angular/protractor/commit/d44ef01c64023b4e3a24a9959740676b691f6074)) feat(debugging): remove webdriver lines from stacktraces by default to improve readability

- ([33fa4a4](https://github.com/angular/protractor/commit/33fa4a43acfbe87f3a4d4c84fa93c5c20b3cca0c)) feat(locators): by model works for anything with a model, not just input

  Notably, by.model will now find selects and textareas.

  Closes #321.

- ([238bb74](https://github.com/angular/protractor/commit/238bb7429572f9a9f6620bf1317690f1ac825960)) feat(ignoresync): ignoreSynchronization now affects the behavior of browser.get

  Now, when ignoring synchronization, calls to browser.get are equivalent to calling
  browser.driver.get.

  Closes #306

- ([30c0ceb](https://github.com/angular/protractor/commit/30c0ceb3e2745d3bcc549f4d4963d9fade132e71)) feat(element) element.all exports an 'each' method

  Usage:
  ```
  element.all(by.model('foo')).each(function(webElement) {
    // Do stuff with webElement.
  });
  ```
  Closes #298

- ([6a73a25](https://github.com/angular/protractor/commit/6a73a25c61a72ef991a604eadae010c90a157266)) feat(by.repeat) by.repeat support for multi ng-repeat

  Make by.repeat (and its column and row friends) work with ng-repeat-start
  and ng-repeat-end elements.

  Closes #366. Closes #182.

## Bug Fixes

- ([50d6fde](https://github.com/angular/protractor/commit/50d6fde25148e24d7ef22be371b04333cdf61e50)) fix(clientSideScripts): bind-template directive shouldn't break bind locators

  Fix "UnknownError: angular.element(...).data(...).$binding[0] is
  undefined" error raised when trying to use "by.binding" locator in any
  element of a page that contains at least one "bind-template" directive.

- ([f8c606b](https://github.com/angular/protractor/commit/f8c606bae7b2f414a67b6349f841881132d9cc97)) fix(webdriver-manager): make sure selenium standalone shuts down nicely

  This addresses selenium server shutdown in two ways
   - the node process will stay open until selenium has exited
   - if the user inputs to STDIN (e.g. press space) selenium will shut down gracefully

- ([e98f71e](https://github.com/angular/protractor/commit/e98f71ebd7778d5c77c41bbecc73e31f1aeca177)) fix(webdriver-manager): fix IEDriver install and running via windows

  Changed the binaries.ie.url function to return the correct URL for the IEDriverServer.
  Created the zip object in the win32 section to be able to decompress IEDriverServer.
  Added a function to normalize a command across OS and spawn it. It allows start the webdriver in win32.

  Seen here:
  https://github.com/yeoman/generator/blob/master/lib/actions/spawn_command.js
  

# 0.14.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([c579a1a](https://github.com/angular/protractor/commit/c579a1a01bae6798a87a5ca8915417775e1b6fb2)), ([f54fd5d](https://github.com/angular/protractor/commit/f54fd5d7c3caa8df319a0115086bb4db8443d856)) feat(webdriver-manager): redo the script to run and install selenium/webdriver

  Breaking Change.
  As outlined in Issue #296, redoing the way the selenium/webdriver
  install and run helper scripts work. Now, the 'webdriver-manager' script
  will be available either locally or globally (depending on how protractor
  was installed). It replaced install_selenium_standalone and the 'start' script
  that was provided after install. Run `webdriver-manager update` to download
  new versions of selected webdriver binaries. Run `webdriver-manager start`
  to start the standalone server. In addition, this fixes issues with running
  the server starter in Windows, and allows automated downloading of the IEDriver.

  Thanks to kurthong and vipper for their PRs with windows fixes, which were
  very useful in preparing this.

- ([a69ebc3](https://github.com/angular/protractor/commit/a69ebc3b783fb7bf42877a658498de90d3d196c3)) feat(runner): use selenium and chromedriver from the default location if nothing else is specified

## Bug Fixes

- ([1fa090c](https://github.com/angular/protractor/commit/1fa090c656cbab55bdbfb101b503b53811b50dff)) fix(runner): merge should override entire arrays, not just parts of them

  Closes #304

- ([a2afb4d](https://github.com/angular/protractor/commit/a2afb4d8399ba980674c79138dd98efb683e9ab9)) fix(element): element.all.get and element.all.first/last should wrap web elements

  Closes #307

- ([f3be172](https://github.com/angular/protractor/commit/f3be1727cf95dea50b597d20c6510e62a605dee2)) fix(runner): running with chromeOnly should try to find chromedriver with .exe extension

  Closes #283

## Breaking Changes

- ([c579a1a](https://github.com/angular/protractor/commit/c579a1a01bae6798a87a5ca8915417775e1b6fb2)) feat(webdriver-manager): redo the script to run and install selenium/webdriver

  Breaking Change.
  Your old selenium/start script will continue to work, but install_selenium_standalone no longer exists.
  To do a clean update, remove the selenium folder. Then run
  `webdriver-manager update`

- ([a1c91a2](https://github.com/angular/protractor/commit/a1c91a29af5c1e1f35744462ca16ef4b33ad6c48)) fix(config): Make all file paths in config files relative to the config file itself

  Breaking Change
  Previously, onPrepare and specs were relative to the location of the config,
  but seleniumServerJar and chromeDriver were relative to the cwd when the
  test was called. If you were calling the tests from somewhere other than
  the same directory as the config location, you will need to change the paths of
  seleniumServerJar and/or chromeDriver.  Closes #222.


# 0.13.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([ce5f494](https://github.com/angular/protractor/commit/ce5f494289c3750b84c6783339a14342a1b74f3d)) feat(element): element.all now has 'first' and 'last' methods

- ([ef61662](https://github.com/angular/protractor/commit/ef6166232186b3385769f63430819a722052cc44)) feat(runner): allow bypassing the selenium standalone server if running only chrome

  Using the config option `chromeOnly` now enables running ChromeDriver directly,
  without going through the Selenium Standalone. The chromedriver binary should be
  available in your PATH, or should be specified with the config option
  `chromeDriver`.

- ([76c094a](https://github.com/angular/protractor/commit/76c094a3fa69511b0311011b0ef2c7343b8e655b)) feat(getLocationAbsUrl) - allows current url to be obtained on IE (and Chrome/Firefox)

- ([6a1c918](https://github.com/angular/protractor/commit/6a1c91848858453d0af712588b51c0bdaa0c9445)) feat(runner): add error message for bad jar path

- ([98bce7e](https://github.com/angular/protractor/commit/98bce7e2ac1e659faf2d8727e1fda210b796525e)) feat(locators): add the ability to add custom element locators with by.addLocator

  Custom locators can now be added using by.addLocator(name, script), where
  script is a self-contained snippet to be executed on the browser which returns
  an array of elements. Closes #236.

- ([c7bcc20](https://github.com/angular/protractor/commit/c7bcc20c07416237f69f7934d257b5ba5bfe8c1f)) chore(angular): update to angular 1.2


## Bug Fixes

- ([a24eeee](https://github.com/angular/protractor/commit/a24eeee4f08e973ffcecd107b6610ce1c2c5e3f6)) fix(runner): do not error out if only one spec pattern does not match any files

  Previously, the runner would throw an error if any one of the spec patterns did not
  match any files. Now it logs a warning in that case, and errors out only if there
  are no found files in any spec patterns. Closes #260

- ([f3b3fdb](https://github.com/angular/protractor/commit/f3b3fdbcbc8fe4f3c5915ef0f6eb7c89e339a62e)) fix(element): fix an error where all.then() wasn't calling callbacks.

  Closes #267

- ([137d804](https://github.com/angular/protractor/commit/137d8040778215fd841654d3ca465b71f8719ea5)) fix(jasminewd): patched matcher should understand 'not'

  Closes #139.


# 0.12.1

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Minor features

- ([201b59c](https://github.com/angular/protractor/commit/201b59c2e728c56d2a88a1167ed3007b22ab9034)) feat(jasminewd): better error messaging when expect is called with a WebElement

- ([d383770](https://github.com/angular/protractor/commit/d383770499da4b08b74ad53c20ffa288147f94e9)) feat(clientsidescripts): better error reporting from testForAngular and waitForAngular

## Bug fixes

- ([8580c0c](https://github.com/angular/protractor/commit/8580c0c76c5ccd3c55d053e59d8df37b3c4cf35a)) fix(install-selenium): update to chromedriver 2.6

  Update to the latest version of Chromedriver. This fixes the issue with
  OS X 10.9. Closes #181.

- ([ebc528f](https://github.com/angular/protractor/commit/ebc528fec2c2e88b0f9e32cee0661ecd79da2252)) fix(debugging): switch debugging tests to the new test app urls.

- ([8ff4787](https://github.com/angular/protractor/commit/8ff47875488647513f4199bab36e3b0023dd305d)) fix(runner): exit with proper code when tests fail

  When errors with messages matching /timeout/ were created, Protractor
  clears the control flow so that the remainder of the tasks scheduled
  for that spec don't bleed over into the next spec. This was messing up
  the promises used in the runner, since they are also webdriver promises.
  Long term, the runner should _not_ use webdriver promises. For now, fix by
  having the runner resolve promises directly rather than through chaining,
  and add a TODO to use promises which aren't connected to WebDriver's
  control flow in the runner.

  Closes #214.

- ([81501c5](https://github.com/angular/protractor/commit/81501c5d941cd7edb15439cef7c7a64c0e773e27)) fix(clientsidescripts): workaround for IE 8 "async page reload" init problem

- ([21264fd](https://github.com/angular/protractor/commit/21264fdc2f6cb3345c8f005936c74985ecd811dc)) fix(find): fix error when exposed to ng-options element with a default option

  Protractor will now ignore elements with the ng-bind class that don't have
  a proper binding on their data, instead of blowing up when encoutering them.

  Closes #165, may fix #170

  - ([f672648](https://github.com/angular/protractor/commit/f6726482cd2ce9a7dda9ccdeeb93574d3b9293e3)) fix(findelements): fix isPresent for repeaters by row for real

## Breaking Changes

- ([bf5b076](https://github.com/angular/protractor/commit/bf5b076cb8897d844c25baa91c263a12c61e3ab3)) fix(cli): remove boolean verbose and stack trace options

  Also add better description for what the command line options are.

  Tiny breaking change:
    Rename the 'includeStackTrace' command line option to 'stackTrace' for brevity.

# 0.12.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

This change introduces major syntax updates. Using the new syntax is recommeded, but the old version is still supported for now. Note also that the test application, docs, and example tests have been updated.

## Features

- ([a2cd6c8](https://github.com/angular/protractor/commit/a2cd6c8baf242a81c4efea1f55249d597de95329)) feat(syntax): big syntax reboot, expose global $, $$, element, and by

In an effort to make tests more readable and clear, a few more global variables
will now be exported.

`browser` is an instance of protractor. This was previously accessed using
`protractor.getInstance`.

`by` is a collection of element locators. Previously, this was `protractor.By`.

`$` is a shortcut for getting elements by css. `$('.foo')` === `element(by.css('.foo'))`

All changes should be backwards incompatible, as tested with the new 'backwardscompat'
tests.

## Bug fixes

- ([8c87ae6](https://github.com/angular/protractor/commit/8c87ae6b430479445744a2f5c8eaca7f5f03d61d)) fix(onPrepare): onPrepare with a string argument should resolve from the config directory

onPrepare can take a string, which is a filename containing a script to load adn execute
before any tests run. This fixes the string to resolve the filename relative to the
config file, instead of relative to the current working directory where protractor
is called.



# 0.11.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

## Features

- ([02cb819](https://github.com/angular/protractor/commit/02cb8199d89c6645d0bc9dbb39e5cb27517bfaf3)) feat(cli): allow passing params directly to your test

Adds a config object 'params' which is passed directly
to instances of protractor. 'params' may contain nested
objects, and can be changed via the command line as:

  --params.login.user 'Joe' --params.login.password 'abc'

This change also switches to using optimist to parse
command line flags for more flexibility and better usage
documentation. Closes #32.

- ([c025ddb](https://github.com/angular/protractor/commit/c025ddbe617b977908db509f365cc882924b196f)) feat(findElements): $ & $$ shortcuts.

Introducing the $ shortcut method for finding a single element by css
without having to call protractor.By.css.  Additionally $$ for finding
all elements by css.

Examples:
- ptor.$('.some .selector')
- ptor.$$('.some .selector')

- ([7d74184](https://github.com/angular/protractor/commit/7d7418411ea4a9d696855f755899161ecb36818d)) feat(explorer): add an interactive element explorer

When debugging or first writing test suites, you may find it helpful to
try out Protractor commands without starting up the entire test suite. You can
do this with the element explorer. This change introduces a first version
of the element explorer. Closes #107

## Bug Fixes

- ([e45ceaa](https://github.com/angular/protractor/commit/e45ceaae825cce0ec69580b8f6e93d102d4d61f1)) fix(repeaters): allow finding all rows of a repeater

Now, finding an element with the strategy 'protractor.By.repeater()' returns
a promise which will resolve to an array of WebElements, where each WebElement
is a row in the repeater. Closes #149.

- ([b501ceb](https://github.com/angular/protractor/commit/b501ceb7b776a5d9f1c2659326577601d0fbce5a)) fix(findElements): Consistently include evaluate.

When using findElements with a css locator, wrap the returned list of
elements with protractor specific functionality.

- ([c17ac12](https://github.com/angular/protractor/commit/c17ac12c2a213a7b6f8c236e81ba5cb2db542fd0)) fix(cli): allow running from command line without a config file

If all necessary fields are specified (e.g. seleniumAddress and at least
one spec), a config file shouldn't be necessary.

## Breaking Changes

- ([421d623](https://github.com/angular/protractor/commit/421d6232fe0b45ca1758afd634997da644f2e1db)) fix(repeat): use 0-based indexing for repeater rows

BREAKING CHANGE: Finding rows with protractor.By.repeater now
indexes from 0 instead of 1. This should be more familiar to most
modern programmers. You will need to edit existing tests. Closes #90.

Before:
```
// The fourth foo
ptor.findElement(protractor.By.repeater('foo in foos').row(4));
```
After:
```
// The fourth foo
ptor.findElement(protractor.By.repeater('foo in foos').row(3));
```

# 0.10.0

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

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

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

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

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

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

_Note: Major version 0 releases are for initial development, and backwards incompatible changes may be introduced at any time._

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
