# 0.7.0

_Note: Major version 0 releases are for initial development, and backwards compatible changes may be introduced at any time._

## Features

- ([7966912](https://github.com/angular/protractor/commit/796691205795d93fe12c998d20a58c8220ac6fb7)) Updating to Selenium 2.24.

- ([90f0a94](https://github.com/angular/protractor/commit/90f0a942b09faff5924674a20ce7705b6d685eba)) Instead of having tests run with the protractor runner need to require()
the protractor library, publish it to the global namespace. This insures
the instance of protractor used within the tests is the same as the
one used on the command line. Closes #36. Version bump for incompatible
API changes.

- ([cb373c9](https://github.com/angular/protractor/commit/cb373c99a7e33c5514bf1d2728a64f631ec8784c)) Adding glob matching to the spec files from the config. Closes #29.


## Breaking changes

- Now running on selenium 2.24. Requires updating WebDriverJS and the selenium standalone binary.

- The protractor runner now publishes `protractor` to the global namespace and sets up the Jasmine-WebDriver adapter. Tests run with this should no longer include

````javascript
// var protractor = require('protractor'); // No longer needed!
// require('protractor/jasminewd'); // No longer needed!

var ptor = protractor.getInstance(); // This should just work now.
````
