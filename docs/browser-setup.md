Setting Up the Browser
=======================

Protractor works with [Selenium WebDriver](http://docs.seleniumhq.org/docs/03_webdriver.jsp), a browser automation framework. Selenium WebDriver supports several browser implementations or [drivers](http://docs.seleniumhq.org/docs/03_webdriver.jsp#selenium-webdriver-s-drivers) which are discussed below.

Browser Support
---------------
Protractor support for a particular browser is tied to the capabilities available in the driver for that browser. Notably, Protractor requires the driver to implement asynchronous script execution.

Protractor supports the two latest major versions of Chrome, Firefox, Safari, and IE.

| Driver                 | Support      | Known Issues    |
|------------------------|--------------|-----------------|
|ChromeDriver            |Yes           |                 |
|FirefoxDriver           |Yes           |[#480](https://github.com/angular/protractor/issues/480) clicking options doesn't update the model|
|SafariDriver            |Yes           |[#481](https://github.com/angular/protractor/issues/481) minus key doesn't work, SafariDriver does not support modals, [#1051](https://github.com/angular/protractor/issues/1051) We see occasional page loading timeouts|
|IEDriver                |Yes           |[#778](https://github.com/angular/protractor/issues/778),  can be slow, [#1052](https://github.com/angular/protractor/issues/1052) often times out waiting for page load|
|OperaDriver             |No            |                 |
|ios-Driver              |No            |                 |
|Appium - iOS/Safari     |Yes*           | drag and drop not supported (session/:sessionid/buttondown unimplemented) |
|Appium - Android/Chrome |Yes*           |                 |
|Selendroid              |Yes*           |                 |

* These drivers are not yet in the Protractor smoke tests.

Configuring Browsers
--------------------

In your Protractor config file (see [referenceConf.js](/docs/referenceConf.js)), all browser setup is done within the `capabilities` object. This object is passed directly to the WebDriver builder ([builder.js](https://code.google.com/p/selenium/source/browse/javascript/webdriver/builder.js)). 


See [DesiredCapabilities](https://code.google.com/p/selenium/wiki/DesiredCapabilities) for full information on which properties are available.

Using Browsers Other Than Chrome
--------------------------------

To use a browser other than Chrome, simply set a different browser name in the capabilities object.

```javascript
capabilities: {
  'browserName': 'firefox'
}
```

You may need to install a separate binary to run another browser, such as IE or Android. For more information, see [SeleniumHQ Downloads](http://docs.seleniumhq.org/download/).

Adding Chrome-Specific Options
------------------------------

Chrome options are nested in the `chromeOptions` object. A full list of options is at the [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/capabilities) site. For example, to show an FPS counter in the upper right, your configuration would look like this:

```javascript
capabilities: {
  'browserName': 'chrome',
  'chromeOptions': {
    'args': ['show-fps-counter=true']
  }
},
```
If running with `chromeOnly` and `chromeOptions` together, chromeOptions.args and chromeOptions.extensions are required due to [Issue 6627](https://code.google.com/p/selenium/issues/detail?id=6627&thanks=6627&ts=1385488060) of selenium-webdriver currently(@2.37.0). So in order to avoid the issue, you may simply set them(or one of them) to an empty array.

Testing Against Multiple Browsers
---------------------------------

If you would like to test against multiple browsers, use the `multiCapabilities` configuration option.

```javascript
multiCapabilities: [{
  'browserName': 'firefox'
}, {
  'browserName': 'chrome'
}]
```

Protractor will run tests in parallel against each set of capabilities. Please note that if `multiCapabilities` is defined, the runner will ignore the `capabilities` configuration.


Setting Up Protractor with Appium - Android/Chrome
-------------------------------------
###### Setup
*   Install Java SDK (>1.6) and configure JAVA_HOME (Important: make sure it's not pointing to JRE).
*   Follow http://spring.io/guides/gs/android/ to install and set up Android developer environment. Do not set up Android Virtual Device as instructed here.
*   From commandline, ```android avd``` and then install an AVD, taking note of the following:
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
*   Follow http://ant.apache.org/manual/index.html to install ant and set up the environment.
*   Follow http://maven.apache.org/download.cgi to install mvn (Maven) and set up the environment. 
   * NOTE: Appium suggests installing Maven 3.0.5 (I haven't tried later versions, but 3.0.5 works for sure).
*   Install Appium using node ```npm install -g appium```. Make sure you don't install as sudo or else Appium will complain.
   * You can do this either if you installed node without sudo, or you can chown the global node_modules lib and bin directories.
*   Start emulator manually (at least the first time) and unlock screen.

```shell
> emulator -avd LatestAndroid
```
* Your devices should show up under adb now:

```shell
> adb devices
List of devices attached 
emulator-5554 device
```
*   If the AVD does not have chrome (and it probably won't if it just created), you need to install it:
   * You can get v34.0.1847.114 from http://www.apk4fun.com/apk/1192/
   * Once you download the apk, install to your AVD as such:

```shell
> adb install ~/Desktop/chrome-browser-google-34.0.1847.114-www.apk4fun.com.apk 
2323 KB/s (30024100 bytes in 12.617s)
Success
```
* If you check your AVD now, it should have Chrome.

###### Running Tests
*   Ensure app is running if testing local app (Skip if testing public website):

```shell
> ./scripts/web-server.js
Starting express web server in /workspace/protractor/testapp on port 8000
```
*   If your AVD isn't already started from the setup, start it now:

```shell
> emulator -avd LatestAndroid
```
*   Start Appium:

```shell
> appium
info: Welcome to Appium v1.0.0-beta.1 (REV 6fcf54391fb06bb5fb03dfcf1582c84a1d9838b6)
info: Appium REST http interface listener started on 0.0.0.0:4723
info: socket.io started
```
*Note Appium listens to port 4723 instead of 4444*

*   Configure protractor:

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
*Note the following:*
 - under capabilities: browserName is '', device is 'android', and app is 'chrome'  
 - baseUrl is 10.0.2.2 instead of localhost because it is used to access the localhost of the host machine in the android emulator  
 - selenium address is using port 4723
 
Setting Up Protractor with Appium - iOS/Safari
-------------------------------------
###### Setup
*   Install Java SDK (>1.6) and configure JAVA_HOME (Important: make sure it's not pointing to JRE).
*   Follow http://ant.apache.org/manual/index.html to install ant and set up the environment.
*   Follow http://maven.apache.org/download.cgi to install mvn (Maven) and set up the environment. 
   * NOTE: Appium suggests installing Maven 3.0.5 (I haven't tried later versions, but 3.0.5 works for sure).
*   Install Appium using node ```npm install -g appium```. Make sure you don't install as sudo or else Appium will complain.
   * You can do this either if you installed node without sudo, or you can chown the global node_modules lib and bin directories.

###### Running Tests
*   Ensure app is running if testing local app (Skip if testing public website):

```shell
> ./scripts/web-server.js
Starting express web server in /workspace/protractor/testapp on port 8000
```
*   Start Appium:

```shell
> appium
info: Welcome to Appium v1.0.0-beta.1 (REV 6fcf54391fb06bb5fb03dfcf1582c84a1d9838b6)
info: Appium REST http interface listener started on 0.0.0.0:4723
info: socket.io started
```
*Note: Appium listens to port 4723 instead of 4444.*

*   Configure protractor:

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
*Note the following:*
 - note capabilities
 - baseUrl is localhost (not 10.0.2.2)
 - selenium address is using port 4723

Setting Up Protractor with Selendroid
-------------------------------------
###### Setup
*   Install Java SDK (>1.6) and configure JAVA_HOME (Important: make sure it's not pointing to JRE).
*   Follow http://spring.io/guides/gs/android/ to install and set up Android developer environment. Do not set up Android Virtual Device as instructed here.
*   From commandline, 'android avd' and then follow Selendroid's recommendation (http://selendroid.io/setup.html#androidDevices). Take note of the emulator accelerator. Here's an example:

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

###### Running Tests
*   Ensure app is running if testing local app (Skip if testing public website):

```shell
> ./scripts/web-server.js
Starting express web server in /workspace/protractor/testapp on port 8000
```

*   Start emulator manually (at least the first time):

```shell
> emulator -avd myAvd
HAX is working and emulator runs in fast virt mode
```

*Note: The last line that tells you the emulator accelerator is running.*
*   Start selendroid:

```shell
> java -jar selendroid-standalone-0.9.0-with-dependencies.jar
...
```

*   Once selendroid is started, you should be able to go to "http://localhost:4444/wd/hub/status" and see your device there:

```javascript
{"value":{"os":{"name":"Mac OS X","arch":"x86_64","version":"10.9.2"},"build":{"browserName":"selendroid","version":"0.9.0"},"supportedDevices":[{"emulator":true,"screenSize":"WVGA800","avdName":"Hank","androidTarget":"ANDROID19"}],"supportedApps":[{"mainActivity":"io.selendroid.androiddriver.WebViewActivity","appId":"io.selendroid.androiddriver:0.9.0","basePackage":"io.selendroid.androiddriver"}]},"status":0}
```

*   Configure protractor:

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

*Note the following:*
 - browserName is 'android'
 - baseUrl is 10.0.2.2 instead of localhost because it is used to access the localhost of the host machine in the android emulator


Setting up PhantomJS
--------------------
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
