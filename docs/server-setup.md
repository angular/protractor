Setting Up the Selenium Server
==============================

When working with Protractor, you need to specify how to connect to the browser drivers which will start up and control the browsers you are testing on. You will most likely use the Selenium Server. The server acts as proxy between your test script (written with the WebDriver API) and the browser driver (controlled by the WebDriver protocols).

The server forwards commands from your script to the driver and returns responses from the driver to your script. The server can handle multiple scripts in different languages. The server can startup and manage multiple browsers in different versions and implementations.

         [Test Scripts] < ------------ > [Selenium Server] < ------------ > [Browser Drivers]

The [config file](/lib/config.ts) includes several options for the Selenium Server, which are explained in the sections below.


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

4. In your config file, set `seleniumAddress` to the address of the running server. This defaults to
   `http://localhost:4444/wd/hub`.


**Starting the Server from a Test Script**

To start the standalone Selenium Server from within your test script, set these options in your config file:

 - `seleniumServerJar` -  The location of the jar file for the standalone Selenium Server. Specify a file location.

 - `seleniumPort` - The port to use to start the standalone Selenium Server. If not specified, defaults to 4444.

 - `seleniumArgs` -  Array of command line options to pass to the server. For a full list, start the server with the `-help` flag.

**Connecting to a Running Server**

To connect to a running instance of a standalone Selenium Server, set this option:

 - `seleniumAddress` -  Connect to a running instance of a standalone Selenium Server. The address will be a URL.

Please note that if you set seleniumAddress, the settings for `seleniumServerJar`, `seleniumPort`, `seleniumArgs`, `browserstackUser`, `browserstackKey`, `sauceUser` and `sauceKey` will be ignored.


Remote Selenium Server
----------------------

To run your tests against a remote Selenium Server, you will need an account with a service that hosts the server (and the browser drivers). Protractor has built in support for [BrowserStack](https://www.browserstack.com) , [Sauce Labs](http://www.saucelabs.com) and [TestObject](https://www.testobject.com).

**Using TestObject as remote Selenium Server**

In your config file, set these options:
 - `testobjectUser` -  The username for your TestObject account.
 - `testobjectKey` -  The key for your TestObject account.

Please note that if you set `testobjectUser` and `testobjectKey`, the settings for `kobitonUser`, `kobitonKey`, `browserstackUser`, `browserstackKey`, `seleniumServerJar`, `seleniumPort`, `seleniumArgs`, `sauceUser` and `sauceKey` will be ignored.

**Using Kobiton as remote Selenium Server**

In your config file, set these options:
 - `kobitonUser` -  The username for your Kobiton account.
 - `kobitonKey` -  The API key from your Kobiton account.

Please note that if you set `kobitonUser` and `kobitonKey`, the settings for `browserstackUser`, `browserstackKey`, `seleniumServerJar`, `seleniumPort`, `seleniumArgs`, `sauceUser` and `sauceKey` will be ignored.

**Using BrowserStack as remote Selenium Server**

In your config file, set these options:
 - `browserstackUser` -  The username for your BrowserStack account.
 - `browserstackKey` -  The key for your BrowserStack account.

Please note that if you set `browserstackUser` and `browserstackKey`, the settings for `seleniumServerJar`, `seleniumPort`, `seleniumArgs`, `sauceUser` and `sauceKey` will be ignored.

You can optionally set the `name` property in a capability in order to give the jobs a name on the server.  Otherwise they will just be allotted a random hash.

**Using Sauce Labs as remote Selenium Server**

In your config file, set these options:
 - `sauceUser` -  The username for your Sauce Labs account.
 - `sauceKey` -  The key for your Sauce Labs account.

Please note that if you set `sauceUser` and `sauceKey`, the settings for `seleniumServerJar`, `seleniumPort`, `seleniumArgs`, `browserstackUser` and `browserstackKey` will be ignored.

You can optionally set the `name` property in a capability in order to give the jobs a name on the server.  Otherwise they will just be called `Unnamed Job`.


Connecting Directly to Browser Drivers
--------------------------------------

Protractor can test directly against Chrome and Firefox without using a Selenium Server. To use this, in your config file set `directConnect: true`.

 - `directConnect: true` -  Your test script communicates directly Chrome Driver or Firefox Driver, bypassing any Selenium Server. If this is true, settings for `seleniumAddress` and `seleniumServerJar` will be ignored. If you attempt to use a browser other than Chrome or Firefox an error will be thrown.

The advantage of directly connecting to browser drivers is that your test scripts may start up and run faster.

Re-using an Existing WebDriver
------------------------------

The use case for re-using an existing WebDriver is when you have existing
`selenium-webdriver` code and are already in control of how the WebDriver is
created, but would also like Protractor to use the same browser, so you can
use protractor's element locators and the rest of its API. This could be
done with the `attachSession` driver provider, but the `attachSession` API is
being removed in `selenium-webdriver` 4.0.0.

Instead of a protractor config file, you create a config object in your test
setup code, and add your already-created WebDriver object and base URL.

```javascript
const ProtractorConfigParser = require('protractor/built/configParser').ConfigParser;
const ProtractorRunner = require('protractor/built/runner').Runner;

const ptorConfig = new ProtractorConfigParser().config_;
ptorConfig.baseUrl = myExistingBaseUrl;
ptorConfig.seleniumWebDriver = myExistingWebDriver;
ptorConfig.noGlobals = true; // local preference

// looks similar to protractor/built/runner.js run()
const ptorRunner = new ProtractorRunner(ptorConfig);
ptorRunner.driverProvider_.setupEnv();
const browser = ptorRunner.createBrowser();
ptorRunner.setupGlobals_(browser); // now you can access protractor.$, etc.
```

Note that this driver provider leaves you in control of quitting the driver,
but that also means Protractor API calls that expect the driver to properly
quit and/or restart the browser, e.g. `restart`, `restartSync`, and
`forkNewDriverInstance`, will not behave as documented.
