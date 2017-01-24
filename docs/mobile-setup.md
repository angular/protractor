Mobile Setup
============

There are many options for using WebDriver to test on mobile browsers. Protractor
does not yet officially support or run its own tests against a particular configuration, but the following are some notes on various setup options.

Setting Up Protractor with Appium - Android/Chrome
-------------------------------------
###### Setup

Use `webdriver-manager` to install `appium` and the Android SDK.  See details
[on the WebDriver Manager page](
https://github.com/angular/webdriver-manager/blob/master/docs/mobile.md).

###### Running Tests
*   Ensure app is running if testing local app (Skip if testing public website):

```shell
> npm start # or `./scripts/web-server.js`
Starting express web server in /workspace/protractor/testapp on port 8000
```

*   Start appium and the Android Emulators (details [on the WebDriver Manager
page](https://github.com/angular/webdriver-manager/blob/master/docs/mobile.md)).

```shell
> webdriver-manager start --android
```

*   Configure protractor:

Config File:
```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',

  specs: ['basic/*_spec.js'],

  // Reference: https://github.com/appium/sample-code/blob/master/sample-code/examples/node/helpers/caps.js
  capabilities: {
    browserName: 'chrome',
    platformName: 'Android',
    platformVersion: '7.0',
    deviceName: 'Android Emulator',
  },

  baseUrl: 'http://10.0.2.2:8000'
};
```
*Note the following:*
 - baseUrl is 10.0.2.2 instead of localhost because it is used to access the localhost of the host machine in the android emulator
 - selenium address is using port 4723

Setting Up Protractor with Appium - iOS/Safari
-------------------------------------
###### Setup

Use `webdriver-manager` to install `appium` and the Android SDK.  See details
[on the WebDriver Manager page](
https://github.com/angular/webdriver-manager/blob/master/docs/mobile.md).

###### Running Tests
*   Ensure app is running if testing local app (Skip if testing public website):

```shell
> npm start # or `./scripts/web-server.js`
Starting express web server in /workspace/protractor/testapp on port 8000
```

*   Start Appium:

```shell
> webdriver-manager start
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

  // Reference: https://github.com/appium/sample-code/blob/master/sample-code/examples/node/helpers/caps.js
  capabilities: {
    browserName: 'safari',
    platformName: 'iOS',
    platformVersion: '7.1',
    deviceName: 'iPhone Simulator',
  },

  baseUrl: 'http://localhost:8000'
};
```

iPad:
```javascript
exports.config = {
  seleniumAddress: 'http://localhost:4723/wd/hub',

  specs: [
    'basic/*_spec.js'
  ],

  // Reference: https://github.com/appium/sample-code/blob/master/sample-code/examples/node/helpers/caps.js
  capabilities: {
    browserName: 'safari',
    platformName: 'iOS',
    platformVersion: '7.1',
    deviceName: 'IPad Simulator',
  },

  baseUrl: 'http://localhost:8000'
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
> npm start # or `./scripts/web-server.js`
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

  capabilities: {
    'browserName': 'android'
  },

  baseUrl: 'http://10.0.2.2:8000'
};
```

*Note the following:*
 - browserName is 'android'
 - baseUrl is 10.0.2.2 instead of localhost because it is used to access the localhost of the host machine in the android emulator

Using `wd` and `wd-bridge`
-------------------------------------

As of version 5.1.0, Protractor uses `webdriver-js-extender` to provide all the
mobile commands you should need (see the API page for details).  However, if you
prefer `wd`, you can access it via `wd-bridge`.  First, install both `wd` and
`wd-bridge` as `devDependencies`:

```shell
npm install --save-dev wd wd-bridge
```

Then, in your config file:

```javascript
  // configuring wd in onPrepare
  // wdBridge helps to bridge wd driver with other selenium clients
  // See https://github.com/sebv/wd-bridge/blob/master/README.md
  onPrepare: function () {
    var wd = require('wd'),
      protractor = require('protractor'),
      wdBridge = require('wd-bridge')(protractor, wd);
    wdBridge.initFromProtractor(exports.config);
  }
```

