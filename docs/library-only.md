Using the Protractor Library
============================

If you would like more control over how your tests are run - for example,
you'd like to use a different test framework, don't want to use the Protractor
command line tool, or have very special setup - you can use only the Protractor
library. Include with

    var protractor = require('protractor');

After setting up a webdriver instance, you can create an instance of
Protractor with

    var protractorInstance = protractor.wrapDriver(driver);
