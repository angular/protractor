Protractor
==========

Protractor is an end to end test framework for Angular applications built on top of webdriver. It is still quite in progress.

To run the sample tests
-----------------------

Install the selenium-webdriver npm module

    npm install selenium-webdriver

[Start up a selenium server.](http://code.google.com/p/selenium/wiki/WebDriverJs#With_Node) By default, the tests expect the selenium server to be running at http://localhost:4444/wd/hub.

Start the test application

    testapp/scripts/web-server.js

You can access the test app at

    http://localhost:8000/app/index.html

Run the tests with

    node httpspec.js
