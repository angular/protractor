Protractor [![Build Status](https://travis-ci.org/angular/protractor.png?branch=master)](https://travis-ci.org/angular/protractor)
==========

Protractor is an end to end test framework for [AngularJS](http://angularjs.org/) applications built on top of [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs). Protractor runs tests against your application running in a real browser, interacting with it as a user would.

Protractor can be run as a standalone binary, or included into your tests as a library. Use [Protractor as a library](https://github.com/angular/protractor/blob/master/docs/library-only.md) if you would like to manage WebDriver and your test setup yourself.

For more information, [read the docs](https://github.com/angular/protractor/tree/master/docs/getting-started.md), or head over to the [FAQ](https://github.com/angular/protractor/blob/master/docs/faq.md).


To run the sample tests
-----------------------

Install protractor with.

    npm install -g protractor

Start up a selenium server (See the appendix below for help with this). By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`.

The node module's example folder contains a simple test suite which runs against angularjs.org. Run with: 

    protractor example/conf.js


Using the Protractor runner
---------------------------

The Protractor runner is a binary which accepts a config file. Install protractor with

    npm install -g protractor
    # Run the line below to see command line options
    protractor

You will need a *configuration file* containing setup info and *test files* containing the actual test scripts. The config file specifies how the runner should start webdriver, where your test files are, and global setup options. The test files use Jasmine framework by default ([read about using mocha instead](https://github.com/angular/protractor/tree/master/docs/using-mocha.md)).

Create a configuration file - an example with detailed comments is shown in `node_modules/protractor/referenceConf.js`. Edit the configuration file to point to your test files.

```javascript
// myConf.js
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['myTest.js', 'myTestFolder/*Test.js']
}
```

The configuration file must specify a way to connection to webdriver. This can be
 *   `seleniumAddress`: The address of a running selenium standalone server.
 *   `seleniumServerJar`: The location of the selenium standalone .jar file on your machine. Protractor will use this to start up the selenium server.
 *   `sauceUser` and `sauceKey`: The username and key for a [SauceLabs](http://www.saucelabs.com) account. Protractor will use this to run tests on SauceLabs.

The runner exposes global variables `browser`, `by` and `element`. Check out [getting started docs](https://github.com/angular/protractor/blob/master/docs/getting-started.md) to learn how to write a test.

```javascript
// myTest.js
describe('angularjs homepage', function() {
  it('should greet the named user', function() {
    browser.get('http://www.angularjs.org');

    element(by.model('yourName')).sendKeys('Julie');

    var greeting = element(by.binding('yourName'));

    expect(greeting.getText()).toEqual('Hello Julie!');
  });
});
```

Run with

    protractor myConf.js


Cloning and running Protractor's own tests
------------------------------------------
Clone the github repository.

    git clone https://github.com/angular/protractor.git
    cd protractor
    npm install

Start up a selenium server. By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`.

Protractor's test suite runs against the included testapp. Start that up with

    cd testapp
    ./scripts/web-server.js

Then run the tests with

    npm test


Appendix A: Setting up a standalone selenium server
---------------------------------------------------

WebdriverJS does not natively include the selenium server - you must start a standalone selenium server. All you need is the latest [selenium-server-standalone.](https://code.google.com/p/selenium/downloads/list). To drive individual browsers, you may need to install separate driver binaries.

To use with chrome browsers, [download chromedriver](http://chromedriver.storage.googleapis.com/index.html).
[More information about chromedriver](https://sites.google.com/a/chromium.org/chromedriver/)

The `webdriver-manager` script is included in the npm package to manage downloads for you. To see the options, run

    npm install -g protractor
    webdriver-manager

Download and start the selenium server with

    webdriver-manager update
    webdriver-manager start

For alternate ways to download and start the selenium standalone, see
[the webdriver docs](http://docs.seleniumhq.org/docs/03_webdriver.jsp#running-standalone-selenium-server-for-use-with-remotedrivers).
