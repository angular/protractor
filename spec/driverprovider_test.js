/**
 * Sanity integration tests for Driver Providers.
 *
 * Assumed setup:
 * - selenium server running locally at http://localhost:4444
 * - selenium jar and chromedriver in protractor/selenium, where
 *   webdriver-manager stores them.
 * - if you want to test saucelabs, test with --sauceUser and --sauceKey
 *
 * You should verify that there are no lingering processes when these tests
 * complete.
 */

var argv = require('optimist').argv;
var q = require('q');

var testDriverProvider = function(driverProvider) {
  return driverProvider.setupEnv().then(function() {
    var driver = driverProvider.getDriver();
    var deferred = q.defer();
    driver.get('about:blank');
    driver.getCurrentUrl().then(function(url) {
      if (url != 'about:blank') {
        throw new Error ('url was not about:blank, instead found ' + url);
      }
      deferred.resolve();
    });
    return deferred.promise;
  }).then(function() {
    if (driverProvider.updateJob) {
      return driverProvider.updateJob({
            'passed': true
          }).then(function() {
            return driverProvider.teardownEnv();
          });
    } else {
      return driverProvider.teardownEnv();
    }
  });
};

var chromeConfig = {
  capabilities: {
    browserName: 'chrome'
  }
};
testDriverProvider(require('../lib/driverProviders/chrome')(chromeConfig)).
    then(function() {
      console.log('chrome.dp working!');
    }, function(err) {
      console.log('chrome.dp failed with ' + err);
    });

var hostedConfig = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    browserName: 'firefox'
  }
};
testDriverProvider(require('../lib/driverProviders/hosted')(hostedConfig)).
    then(function() {
      console.log('hosted.dp working!');
    }, function(err) {
      console.log('hosted.dp failed with ' + err);
    });

var hostedPromisedConfig = {
  seleniumAddress: q.when('http://localhost:4444/wd/hub'),
  capabilities: {
    browserName: 'firefox'
  }
};
testDriverProvider(require('../lib/driverProviders/hosted')(hostedPromisedConfig)).
    then(function() {
      console.log('hosted.dp with promises working!');
    }, function(err) {
      console.log('hosted.dp with promises failed with ' + err);
    });

var localConfig = {
  seleniumArgs: [],
  capabilities: {
    browserName: 'chrome'
  }
};
testDriverProvider(require('../lib/driverProviders/local')(localConfig)).
    then(function() {
      console.log('local.dp working!');
    }, function(err) {
      console.log('local.dp failed with ' + err);
    });

if (argv.sauceUser && argv.sauceKey) {
  var sauceConfig = {
    sauceUser: argv.sauceUser,
    sauceKey: argv.sauceKey,
    capabilities: {
      browserName: 'chrome'
    }
  };
  testDriverProvider(require('../lib/driverProviders/sauce')(sauceConfig)).
      then(function() {
        console.log('sauce.dp working!');
      }, function(err) {
        console.log('sauce.dp failed with ' + err);
      });
}
