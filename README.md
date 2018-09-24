Protractor [![Build Status](https://travis-ci.org/angular/protractor.png?branch=master)](https://travis-ci.org/angular/protractor) [![Join the chat at https://gitter.im/angular/protractor](https://badges.gitter.im/angular/protractor.svg)](https://gitter.im/angular/protractor)
==========

[Protractor](http://angular.github.io/protractor) is an end-to-end test framework for [AngularJS](http://angularjs.org/) applications. Protractor is a [Node.js](http://nodejs.org/) program built on top of [WebDriverJS](https://github.com/SeleniumHQ/selenium/wiki/WebDriverJs). Protractor runs tests against your application running in a real browser, interacting with it as a user would.

Compatibility
-------------

Protractor 3 is compatible with nodejs v4 and newer.

When using nodejs v0.12, use protractor 2 (`npm install -g protractor@2`).

Getting Started
---------------

The Protractor documentation for users is located in the [protractor/docs](https://github.com/angular/protractor/tree/master/docs) folder.

To get set up and running quickly:
 - The [Protractor Website](http://angular.github.io/protractor)
 - Work through the [Tutorial](http://angular.github.io/protractor/#/tutorial)
 - Take a look at the [Table of Contents](http://angular.github.io/protractor/#/toc)

Once you are familiar with the tutorial, you’re ready to move on. To modify your environment, see the Protractor Setup docs. To start writing tests, see the Protractor Tests docs.

To better understand how Protractor works with the Selenium WebDriver and Selenium Server see the reference materials.


Getting Help
------------

Check the [Protractor FAQ](https://github.com/angular/protractor/blob/master/docs/faq.md) and read through the [Top 20 questions on StackOverflow](http://stackoverflow.com/questions/tagged/protractor?sort=votes&pageSize=20).

Please ask usage and debugging questions on [StackOverflow](http://stackoverflow.com/questions/tagged/protractor) (use the ["protractor"](http://stackoverflow.com/questions/ask?tags=protractor) tag), the [Gitter](https://gitter.im/angular/protractor) chat room, or in the [Angular discussion group](https://groups.google.com/forum/?fromgroups#!forum/angular). (Please do not ask support questions here on Github.)


For Contributors
----------------
Clone the github repository:

    git clone https://github.com/angular/protractor.git
    cd protractor
    npm install
    ./bin/webdriver-manager update
    cd website
    npm install
    cd ..

Start up a selenium server. By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`. A selenium server can be started with `webdriver-manager`.

    bin/webdriver-manager start

Protractor's test suite runs against the included test application. Start that up with

    npm start

Then run the tests with

    npm test
