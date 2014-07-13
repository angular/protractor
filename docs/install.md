Getting Installed
=================

Prerequisites
-------------

**Node.js**

Protractor is a Node.js program. To run Protractor, you will need to have Node.js installed. Check the version of node you have by running `node --version`. It should be greater than v0.10.0. 

Node.js comes with the Protractor npm package, which you can use to install Protractor.

**JDK**

To run the Selenium Server, you will need to have Java Development Kit (JDK) installed.  Check this by running `java --version` from the command line.

Installing Protractor
---------------------

Use npm to install Protractor globally (omit the -g if you’d prefer not to install globally):

    npm install -g protractor

Check that Protractor is working by running `protractor --version`.

The Protractor install includes the following:
 - `protractor` command line tool
 - `webdriver-manager` command line tool
 - Protractor API (library)

Installing the Selenium Server
------------------------------
Use `webdriver-manager` to set up the standalone Selenium Server. 

First, run the update command. This will install the server and ChromeDriver.

    webdriver-manager update

Next, start the server with:

    webdriver-manager start

You will see a lot of output logs, starting with INFO. The last line will be 'Info - Started org.openqa.jetty.jetty.Server'. 

Leave the server running while you conduct your test sessions.
