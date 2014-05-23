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
If running with chromeOnly and chromeOptions together, chromeOptions.args and chromeOptions.extensions are required due to [Issue 6627](https://code.google.com/p/selenium/issues/detail?id=6627&thanks=6627&ts=1385488060) of selenium-webdriver currently(@2.37.0). So in order to avoid the issue, you may simply set them(or one of them) to an empty array.

Testing against multiple browsers
---------------------------------

If you would like to test against multiple browsers at once, use the multiCapabilities configuration option.

```javascript
multiCapabilities: [{
  'browserName': 'firefox'
}, {
  'browserName': 'chrome'
}]
```

Protractor will run tests in parallel against each set of capabilities. Please note that if multiCapabilities is defined, the runner will ignore the `capabilities` configuration.

Browser Support
---------------
Protractor uses webdriver, so protractor support for a particular browser is tied to the capabilities available in the Driver for that browser. Notably, Protractor requires the driver to implement asynchronous script execution.

| Driver                 | Support      | Known Issues    |
|------------------------|--------------|-----------------|
|ChromeDriver            |Yes           |                 |
|FirefoxDriver           |Yes           |[#480](https://github.com/angular/protractor/issues/480)|
|SafariDriver            |Yes           |[#481](https://github.com/angular/protractor/issues/481), SafariDriver does not support modals|
|IEDriver                |Yes           |[#778](https://github.com/angular/protractor/issues/778), IEDriver can be slow|
|OperaDriver             |No            |                 |
|ios-Driver              |No            |                 |
|Appium - iOS/Safari     |Yes           | drag and drop not supported (session/:sessionid/buttondown unimplemented) |
|Appium - Android/Chrome |Yes           |                 |
|Selendroid              |Yes           |                 |

How to set up Protractor with Appium - Android/Chrome
-------------------------------------
###### Set up
*   Install Java SDK (>1.6) and configure JAVA_HOME (Important: make sure it's not pointing to JRE).
*   Follow http://spring.io/guides/gs/android/ to install and set up Android developer environment. Do not set up Android Virtual Device as instructed here
*   From commandline, ```android avd``` and then install an AVD, taking note of the following
   * Start with an ARM ABI
   * Enable hardware keyboard: ```hw.keyboard=yes```
   * Enable hardware battery: ```hw.battery=yes```
   * Use the Host GPU
   * Here's an example:

Phone:
```shell
> android list avd
Available Android Virtual Devices:
    Name: LatestAndroid
  Device: Nexus 5 (Google)
    Path: /Users/hankduan/.android/avd/LatestAndroid.avd
  Target: Android 4.4.2 (API level 19)
 Tag/ABI: default/armeabi-v7a
    Skin: HVGA
```

Tablet:
```shell
> android list avd
Available Android Virtual Devices:
    Name: LatestTablet
  Device: Nexus 10 (Google)
    Path: /Users/hankduan/.android/avd/LatestTablet.avd
  Target: Android 4.4.2 (API level 19)
 Tag/ABI: default/armeabi-v7a
    Skin: WXGA800-7in
```
*   Follow http://ant.apache.org/manual/index.html to install ant and set up the environment
*   Follow http://maven.apache.org/download.cgi to install mvn (Maven) and set up the environment. 
   * NOTE: Appium suggests installing Maven 3.0.5 (I haven't tried later versions, but 3.0.5 works for sure)
*   Install Appium using node ```npm install -g appium```. Make sure you don't install as sudo or else Appium will complain
   * You can do this either if you installed node without sudo, or you can chown the global node_modules lib and bin directories
*   Start emulator manually (at least the first time) and unlock screen

```shell
> emulator -avd LatestAndroid
```
* Your devices should show up under adb now

```shell
> adb devices
List of devices attached 
emulator-5554 device
```
*   If the AVD does not have chrome (and it probably won't if it just created), you need to install it
   * You can get v34.0.1847.114 from http://www.apk4fun.com/apk/1192/
   * Once you download the apk, install to your AVD as such:

```shell
> adb install ~/Desktop/chrome-browser-google-34.0.1847.114-www.apk4fun.com.apk 
2323 KB/s (30024100 bytes in 12.617s)
Success
```
* If you check your AVD now, it should have Chrome

###### Running test
*   Ensure app is running if testing local app (Skip if testing public website)

```shell
> ./scripts/web-server.js
Starting express web server in /workspace/protractor/testapp on port 8000
```
*   If your AVD isn't already started from the setup, start it now

```shell
> emulator -avd LatestAndroid
```
*   Start Appium

```shell
> appium
info: Welcome to Appium v1.0.0-beta.1 (REV 6fcf54391fb06bb5fb03dfcf1582c84a1d9838b6)
info: Appium REST http interface listener started on 0.0.0.0:4723
info: socket.io started
```
*Note Appium listens to port 4723 instead of 4444*

*   Configure protractor, i.e.

```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  chromeOnly: false,

  capabilities: {
    device: 'android',
    'browserName': '',
    //'deviceName' : 'emulator-5554',
    'app' : 'chrome'
  },

  baseUrl: 'http://10.0.2.2:' + (process.env.HTTP_PORT || '8000'),
};
```
*note three things:*  
 -under capabilities: browserName is '', device is 'android', and app is 'chrome'  
 -baseUrl is 10.0.2.2 instead of localhost because it is used to access the localhost of the host machine in the android emulator  
 -selenium address is using port 4723  
 
How to set up Protractor with Appium - iOS/Safari
-------------------------------------
###### Set up
*   Install Java SDK (>1.6) and configure JAVA_HOME (Important: make sure it's not pointing to JRE).
*   Follow http://ant.apache.org/manual/index.html to install ant and set up the environment
*   Follow http://maven.apache.org/download.cgi to install mvn (Maven) and set up the environment. 
   * NOTE: Appium suggests installing Maven 3.0.5 (I haven't tried later versions, but 3.0.5 works for sure)
*   Install Appium using node ```npm install -g appium```. Make sure you don't install as sudo or else Appium will complain
   * You can do this either if you installed node without sudo, or you can chown the global node_modules lib and bin directories

###### Running test
*   Ensure app is running if testing local app (Skip if testing public website)

```shell
> ./scripts/web-server.js
Starting express web server in /workspace/protractor/testapp on port 8000
```
*   Start Appium

```shell
> appium
info: Welcome to Appium v1.0.0-beta.1 (REV 6fcf54391fb06bb5fb03dfcf1582c84a1d9838b6)
info: Appium REST http interface listener started on 0.0.0.0:4723
info: socket.io started
```
*Note Appium listens to port 4723 instead of 4444*

*   Configure protractor, i.e.

iPhone:
```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  chromeOnly: false,

  capabilities: {
    browserName: '',
    device: 'iPhone',
    app: 'safari'
  },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8000')
};
```

iPad:
```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  chromeOnly: false,

  capabilities: {
    browserName: '',
    device: 'iPad',
    app: 'safari',
    deviceName: 'iPad Simulator'
  },

  baseUrl: 'http://localhost:' + (process.env.HTTP_PORT || '8000')
};

```
*note three things:*  
 -note capabilities  
 -baseUrl is localhost (not 10.0.2.2)  
 -selenium address is using port 4723  

How to set up Protractor with Selendroid
-------------------------------------
###### Set up
*   Install Java SDK (>1.6) and configure JAVA_HOME (Important: make sure it's not pointing to JRE).
*   Follow http://spring.io/guides/gs/android/ to install and set up Android developer environment. Do not set up Android Virtual Device as instructed here
*   from commandline, 'android avd' and then follow Selendroid's recommendation (http://selendroid.io/setup.html#androidDevices). Take note of the emulator accelerator. Here's an example:

```shell
> android list avd
Available Android Virtual Devices:
    Name: myAvd
  Device: Nexus 5 (Google)
    Path: /Users/hankduan/.android/avd/Hank.avd
  Target: Android 4.4.2 (API level 19)
 Tag/ABI: default/x86
    Skin: WVGA800
```

###### Running test
*   Ensure app is running if testing local app (Skip if testing public website)

```shell
> ./scripts/web-server.js
Starting express web server in /workspace/protractor/testapp on port 8000
```

*   Start emulator manually (at least the first time)

```shell
> emulator -avd myAvd
HAX is working and emulator runs in fast virt mode
```

*note the last line that tells you the emulator accelerator is running*
*   Start selendroid 

```shell
> java -jar selendroid-standalone-0.9.0-with-dependencies.jar
...
```

*   Once selendroid is started, you should be able to go to "http://localhost:4444/wd/hub/status" and see your device there, i.e.

```javascript
{"value":{"os":{"name":"Mac OS X","arch":"x86_64","version":"10.9.2"},"build":{"browserName":"selendroid","version":"0.9.0"},"supportedDevices":[{"emulator":true,"screenSize":"WVGA800","avdName":"Hank","androidTarget":"ANDROID19"}],"supportedApps":[{"mainActivity":"io.selendroid.androiddriver.WebViewActivity","appId":"io.selendroid.androiddriver:0.9.0","basePackage":"io.selendroid.androiddriver"}]},"status":0}
```

*   Configure protractor, i.e.

```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  chromeOnly: false,

  capabilities: {
    'browserName': 'android'
  },

  baseUrl: 'http://10.0.2.2:' + (process.env.HTTP_PORT || '8000')
};
```

*note two things:*  
 -browserName is 'android'  
 -baseUrl is 10.0.2.2 instead of localhost because it is used to access the localhost of the host machine in the android emulator


PhantomJS
-------------------------------------
In order to test locally with [PhantomJS](http://phantomjs.org/), you'll need to either have it installed globally, or relative to your project. For global install see the [PhantomJS download page](http://phantomjs.org/download.html). For relative install run: `npm install --save-dev phantomjs`.

Add phantomjs to the driver capabilities, and include a path to the binary if using local installation:
```javascript
capabilities: {
  'browserName': 'phantomjs',

  /* 
   * Can be used to specify the phantomjs binary path.
   * This can generally be ommitted if you installed phantomjs globally.
   */
  'phantomjs.binary.path':'./node_modules/phantomjs/bin/phantomjs',
  
  /*
   * Command line arugments to pass to phantomjs. 
   * Can be ommitted if no arguments need to be passed. 
   * Acceptable cli arugments: https://github.com/ariya/phantomjs/wiki/API-Reference#wiki-command-line-options
   */
  'phantomjs.cli.args':['--logfile=PATH', '--loglevel=DEBUG']
}
```

Appendix A: Using with the Protractor Library
---------------------------------------------

If you are not using the Protractor runner (for example, you're using Mocha) and you are setting up webdriver yourself, you will need to create a capabilities object and pass it in to the webdriver builder. The `webdriver.Capabilities` namespace offers some preset options. See [the webdriver capabilities source](https://code.google.com/p/selenium/source/browse/javascript/webdriver/capabilities.js).

```javascript
driver = new webdriver.Builder().
	  usingServer('http://localhost:4444/wd/hub').
    withCapabilities(webdriver.Capabilities.phantomjs()).
    build();
```
