Protractor
==========

Protractor is an end to end test framework for Angular applications built on top of [webdriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs).

Protractor can be run as a standalone binary runner, or included into your tests as a library. Use Protractor as a library if you would like to manage WebDriver and your test setup yourself.


To run the sample tests
-----------------------

Install protractor with.

    npm install protractor

Start up a selenium server (See the appendix below for help with this). By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`.

The example folder contains multiple versions of a simple test suite which runs against angularjs.org.

`onJasmineNodeSpec.js` and `onMocha.js` show how to use the Protractor library with jasmine-node and mocha. Run these with:

    jasmine-node example/onJasmineNodeSpec.js
    mocha example/onMocha.js

You can also run the example suite using the Protractor runner. The runner accepts a configuration file, which runs the tests at `example/onProtractorRunner.js`.

    bin/protractor example/protractorConf.js


Using the Protractor runner
---------------------------

The Protractor runner is a binary which accepts a config file. The Protractor runner runs tests written in Jasmine, but other adapters may be added in the future.

Install protractor with

    npm install protractor

Create a configuration file - an example is shown in `node_modules/protractor/conf.js`.

    cp node_modules/protractor/conf.js myConf.js

Edit the configuration file to point to your tests.

    exports.config = {
      jasmineNodeOpts: {
        specs: ['myTest.js', 'myFolder/myOtherTest.js']
      }
    }

The configuration file must also specify a way of connection to webdriver. This can be
 *   `seleniumAddress`: The address of a running selenium standalone server.
 *   `seleniumServerJar`: The location of the selenium standalone .jar file on your machine. Protractor will use this to start up the selenium server.
 *   `sauceUser` and `sauceKey`: The username and key for a [SauceLabs](http://www.saucelabs.com) account. Protractor will use this to run tests on SauceLabs.

Run with

    node_modules/.bin/protractor myConf.js

Or, if you installed protractor globally (using `npm install -g protractor`)

    protractor myConf.js

When using the runner, the protractor library is exported to the global namespace as `protractor`. The current instance can be grabbed with `ptor = protractor.getInstance()`.


Using the Protractor library
----------------------------

Use the Protractor library if you would like to manage webdriverJs yourself.

Install protractor with

    npm install protractor

In your test, set up a webdriver instance, then wrap it with protractor.

    var protractor = require('protractor');
    var driver;
    // Set up driver as a webdriver however you'd like.
    var ptor = protractor.wrapDriver(driver);


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

WebdriverJS does not natively include the selenium server - you must start a standalone selenium server. All you need is the latest [selenium-server-standalone.](https://code.google.com/p/selenium/downloads/list)

To use with chrome browsers, [download chromedriver](https://code.google.com/p/chromedriver/downloads/list).
[More information about chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver)

A script is included to do the download for you - run with (add the --nocd option if you do not want to install ChromeDriver)

    ./node_modules/protractor/bin/install_selenium_standalone

Start the selenium standalone with

    java -jar selenium/selenium-server-standalone-2.34.0.jar -Dwebdriver.chrome.driver=./selenium/chromedriver
