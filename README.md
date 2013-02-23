Protractor
==========

Protractor is an end to end test framework for Angular applications built on top of [webdriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs). It is still quite in progress.

To run the sample tests
-----------------------

Install the selenium-webdriver npm module

    npm install selenium-webdriver

Start up a selenium server. By default, the tests expect the selenium server to be running at http://localhost:4444/wd/hub.

Start the test application

    testapp/scripts/web-server.js

You can access the test app at

    http://localhost:8000/app/index.html

Run the tests with

    node httpspec.js

To just use Protractor
----------------------

Start a selenium server.

Install the npm modules for selenium-webdriver and protractor:

    npm install selenium-webdriver
    npm install protractor

In your test file, set up protractor:

    var webdriver = require('selenium-webdriver');
    var protractor = require('./protractor.js');
    // Configure and build your webdriver instance.
    var ptor = protractor.wrapDriver(driver);

See httpspec.js for examples of use.

Appendix A: Setting up a standalone selenium server
---------------------------------------------------

WebdriverJS does not natively include the selenium server - you must start a standalone selenium server.
Download the selenium server. All you need is the latest [selenium-server-standalone.](https://code.google.com/p/selenium/downloads/list)

To use with chrome browsers, [download chromedriver](https://code.google.com/p/chromedriver/downloads/list)
[More information about chromedriver](https://code.google.com/p/selenium/wiki/ChromeDriver)

Start the selenium standalone with 

    java -jar selenium-server-standalone-2.x.x.jar
