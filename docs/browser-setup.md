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

```json
capabilities: {
  'browserName': 'firefox'
}
```

You may need to install a separate binary to run another browser, such as IE or Android.

Adding chrome-specific options
------------------------------

Chrome options are nested in the `chromeOptions` object. A full list of options is at [the chromedriver site](https://sites.google.com/a/chromium.org/chromedriver/capabilities). For example, to show an FPS counter in the upper right, your configuration would look like this:

```json
capabilities: {
  'browserName': 'chrome',
  'chromeOptions': {
    'args': ['show-fps-counter=true']
  }
},
```
