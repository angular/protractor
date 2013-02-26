Protractor
==========

Protractor is an end to end test framework for Angular applications built on top of webdriver. It is still quite in progress.

To run the sample tests
-----------------------

Clone the github repository. Install the selenium-webdriver npm module

    npm install selenium-webdriver

[Start up a selenium server](http://code.google.com/p/selenium/wiki/WebDriverJs#With_Node). By default, the tests expect the selenium server to be running at http://localhost:4444/wd/hub.

Start the test application

    cd testapp; scripts/web-server.js

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