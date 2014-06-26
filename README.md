Protractor [![Build Status](https://travis-ci.org/angular/protractor.png?branch=master)](https://travis-ci.org/angular/protractor)
==========

Protractor is an end-to-end test framework for [AngularJS](http://angularjs.org/) applications. Protractor is a Node.js program built on top of [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs). Protractor runs tests against your application running in a real browser, interacting with it as a user would. 


Getting Started
---------------

The Protractor documentation for users is located in the [protractor/docs](https://github.com/angular/protractor/tree/master/docs) folder.

To get set up and running  quickly:
 - Work through the [Tutorial](https://github.com/angular/protractor/blob/master/docs/tutorial.md)
 - Take a look at the [Table of Contents](https://github.com/angular/protractor/blob/master/docs/toc.md)

To better understand how Protractor works with the Selenium WebDriver and Selenium Sever see the reference materials.


For contributors
----------------
Clone the github repository:

    git clone https://github.com/angular/protractor.git
    cd protractor
    npm install

Start up a selenium server. By default, the tests expect the selenium server to be running at `http://localhost:4444/wd/hub`.

Protractor's test suite runs against the included test application. Start that up with

    npm start

Then run the tests with

    npm test
