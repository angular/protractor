Setting Up the Selenium Server
==============================

When working with Protractor you will most likely use the Selenium Server. The server acts as proxy between your test script (written with the WebDriver API) and the browser driver (controlled by the WebDriver protocols). 

The server forwards commands from your script to the driver and returns responses from the driver to your script. The server can handle multiple scripts in different languages. The server can startup and manage multiple browsers in different versions and implementations. 

         [Test Scripts] < ------------ > [Selenium Server] < ------------ > [Browser Drivers]

The [reference config file](/docs/referenceConf.js) includes several options for the Selenium Server, which are explained in the sections below.


Standalone Selenium Server
--------------------------

To run the Selenium Server on your local machine, use the standalone Selenium Server. 

**JDK**

To run a local Selenium Server, you will need to have the [Java Development Kit (JDK)](http://www.oracle.com/technetwork/java/javase/downloads/index.html) installed.  Check this by running `java -version` from the command line.


**Installing and Starting the Server**

To install and start the standalone Selenium Server manually, use the webdriver-manager command line tool, which comes with Protractor.

1. Run the update command:
    `webdriver-manager update`
     This will install the server and ChromeDriver.

2. Run the start command:
   `webdriver-manager start`
    This will start the server. You will see a lot of output logs, starting with INFO. The last 
    line will  be 'Info - Started org.openqa.jetty.jetty.Server'.

3. Leave the server running while you conduct your test sessions.


**Starting the Server from a Test Script**

To start the standalone Selenium Server from within your test script, set these options in your config file:

 - `seleniumServerJar` -  The location of the jar file for the standalone Selenium Server. Specify a file location.

 - `seleniumPort` - The port to use to start the standalone Selenium Server. If not specified, defaults to 4444.

 - `seleniumArgs` -  Array of command line options to pass to the server. For a full list, start the server with the `-help` flag.

**Connecting to a Running Server**

To connect to a running instance of a standalone Selenium Server, set this option:

 - `seleniumAddress` -  Connect to a running instance of a standalone Selenium Server. The address will be a URL.

Please note that if you set seleniumAddress, the settings for `seleniumServerJar`, `seleniumPort` and `seleniumArgs` will be ignored.


Remote Selenium Server
----------------------

To run your tests against a remote Selenium Server, you will need an account with a service that hosts the server (and the browser drivers). Protractor has built in support for [Sauce Labs](http://www.saucelabs.com).

In your config file, set these options:
 - `sauceUser` -  The username for your Sauce Labs account.
 - `sauceKey` -  The key for your Sauce Labs account.

Please note that if you set `sauceUser` and `sauceKey`, the settings for `seleniumServerJar`, `seleniumPort` and `seleniumArgs` will be ignored.


Selenium Server and the Chrome Browser
--------------------------------------

The Selenium Server is optional when you test against the Chrome browser. In your config file, you can set the chromeOnly option to true or false:

 - `chromeOnly: false` -  Your test script communicates with the Selenium Server (running locally or remotely). This is the default setting.

 - `chromeOnly: true` -  Your test script communicates directly with the ChromeDriver. The Selenium Server (running locally or remotely) will be ignored.

The advantage of running only with Chrome is that your test scripts will start up and run faster. For more detailed information about chromeOnly, see the [chrome.js source code](https://code.google.com/p/selenium/source/browse/javascript/node/selenium-webdriver/chrome.js).
