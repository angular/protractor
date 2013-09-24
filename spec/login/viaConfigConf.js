// This is the configuration file showing how a suite of tests might
// handle log-in using the onPrepare field.
exports.config = {
  seleniumServerJar: './selenium/selenium-server-standalone-2.35.0.jar',
  chromeDriver: './selenium/chromedriver',

  seleniumAddress: 'http://localhost:4444/wd/hub',

  specs: [
    'viaConfigSpec.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  onPrepare: function() {
    var ptor = protractor.getInstance();
    ptor.driver.get('http://localhost:8000/app/login.html');

    ptor.driver.findElement(protractor.By.id('username')).sendKeys('Jane');
    ptor.driver.findElement(protractor.By.id('password')).sendKeys('1234');
    ptor.driver.findElement(protractor.By.id('clickme')).click();

    // Login takes some time, so wait until it's done.
    // For the test app's login, we know it's done when it redirects to
    // index.html.
    ptor.wait(function() {
      return ptor.driver.getCurrentUrl().then(function(url) {
        return /index/.test(url);
      });
    });
  },

  baseUrl: 'http://localhost:8000',
};
