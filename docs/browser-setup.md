Setting up your Browser
=======================

Protractor is agnostic to how you set up your browser - it wraps WebDriverJS, so all browser setup for WebDriverJS applies. This doc serves as a collection for information surrounding how to set up browsers.

Configuring Browsers
--------------------

In your Protractor configuration file, all browser set up is done within the `capabilities` JSON object. This is passed directly to the WebDriver Builder.

See [the DesiredCapabilities Docs](https://code.google.com/p/selenium/wiki/DesiredCapabilities) for full information on which properties are available.

Switching to a browser besides Chrome
-------------------------------------

Simply set a different browser name in the capabilites object

```javascript
capabilities: {
  'browserName': 'firefox'
}
```

You may need to install a separate binary to run another browser, such as IE or Android.

### Adding chrome-specific options

Chrome options are nested in the `chromeOptions` object. A full list of options is at [the chromedriver site](https://sites.google.com/a/chromium.org/chromedriver/capabilities). For example, to show an FPS counter in the upper right, your configuration would look like this:

```javascript
capabilities: {
  'browserName': 'chrome',
  'chromeOptions': {
    'args': ['show-fps-counter=true']
  }
},
```

PhantomJS
-------------------------------------
In order to test locally with [PhantomJS](http://phantomjs.org/), you'll need to either have it installed globally, or relative to your project. For global install see the [PhantomJS download page](http://phantomjs.org/download.html). For relative install run: `npm install --save-dev phantomjs`.

Add phantomjs to the driver capabilities, and include a path to the binary if using local installation:
```javascript
capabilities: {
  'browserName': 'phantomjs',

  // should be able to omit this property if phantomjs installed globally
  'phantomjs.binary.path':'./node_modules/phantomjs/bin/phantomjs'
}
```

Jasmine tests should work without further customization. If you are using Mocha, or another framework, the driver will need to be adjusted accordingly:
```javascript
driver = new webdriver.Builder().
	usingServer('http://localhost:4444/wd/hub').withCapabilities(webdriver.Capabilities.phantomjs()).build();
```


