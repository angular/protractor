/**
 * Sanity integration tests for Driver Providers.
 *
 * Assumed setup:
 * - selenium server running locally at http://localhost:4444
 * - selenium jar and chromedriver in protractor/selenium, where
 *   webdriver-manager stores them.
 * - if you want to test saucelabs, test with --sauceUser and --sauceKey
 * - if you want to test browserstack driverProvider, test with 
     --browserstackUser and --browserstackKey
 * You should verify that there are no lingering processes when these tests
 * complete.
 */

const argv = require('optimist').argv;
const env = require('./environment');

const Direct = require('../built/driverProviders/direct').Direct;
const Hosted = require('../built/driverProviders/hosted').Hosted;
const Local = require('../built/driverProviders/local').Local;
const Sauce = require('../built/driverProviders/sauce').Sauce;
const BrowserStack = require('../built/driverProviders/browserStack').BrowserStack;

const testDriverProvider = async (driverProvider) => {
  await driverProvider.setupEnv();
  const driver = driverProvider.getNewDriver();
  await driver.get('about:blank');
  const url = await driver.getCurrentUrl();
  if (url != 'about:blank') {
    throw new Error(`url was not about:blank, instead found ${url}`);
  }
  
  if (driverProvider.updateJob) {
    await driverProvider.updateJob({'passed': true});
    await driverProvider.teardownEnv();
  } else {
    await driverProvider.teardownEnv();
  }
};

const chromeConfig = {
  capabilities: {
    browserName: 'chrome'
  }
};

testDriverProvider(new Direct(chromeConfig)).
    then(() => {
      console.log('direct.dp with chrome working!');
    }, (err) => {
      console.error('direct.dp with chrome failed with', err);
      throw err;
    });

const firefoxConfig = {
  capabilities: {
    browserName: 'firefox'
  }
};
testDriverProvider(new Direct(firefoxConfig)).
    then(() => {
      console.log('direct.dp with firefox working!');
    }, (err) => {
      console.error('direct.dp with firefox failed with', err);
      throw err;
    });

const hostedConfig = {
  seleniumAddress: env.seleniumAddress,
  capabilities: {
    browserName: 'firefox'
  }
};
testDriverProvider(new Hosted(hostedConfig)).
    then(() => {
      console.log('hosted.dp working!');
    }, (err) => {
      console.error('hosted.dp failed with', err);
      throw err;
    });

const hostedPromisedConfig = {
  seleniumAddress: Promise.resolve(env.seleniumAddress),
  capabilities: {
    browserName: 'firefox'
  }
};
testDriverProvider(new Hosted(hostedPromisedConfig)).
    then(() => {
      console.log('hosted.dp with promises working!');
    }, (err) => {
      console.error('hosted.dp with promises failed with', err);
      throw err;
    });

const localConfig = {
  seleniumArgs: [],
  capabilities: {
    browserName: 'chrome'
  }
};
testDriverProvider(new Local(localConfig)).
    then(() => {
      console.log('local.dp working!');
    }, (err) => {
      console.error('local.dp failed with', err);
      throw err;
    });

if (argv.sauceUser && argv.sauceKey) {
  const sauceConfig = {
    sauceUser: argv.sauceUser,
    sauceKey: argv.sauceKey,
    sauceBuild: argv.sauceBuild,
    capabilities: {
      browserName: 'chrome'
    }
  };
  testDriverProvider(new Sauce(sauceConfig)).
      then(() => {
        console.log('sauce.dp working!');
      }, (err) => {
        console.error('sauce.dp failed with', err);
        throw err;
      });
}

if (argv.browserstackUser && argv.browserstackKey) {
  const browserStackConfig = {
    browserstackUser: argv.browserstackUser,
    browserstackKey: argv.browserstackKey,
    capabilities: {
      'build': 'protractor-browserstack-spec',
      'name': 'protractor-browserstack-spec',
      'browserName': 'chrome',
    }
  };
  testDriverProvider(new BrowserStack(browserStackConfig)).
      then(() => {
        console.log('browserstack.dp working!');
      }, (err) => {
        console.error('browserstack.dp failed with', err);
        throw err;
      });
}
