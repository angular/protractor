"use strict";

var DZoneSite = require('./Dzone.js').DZoneSite;

//Test1
fdescribe('Protractor Perfecto Demo', function () {

  beforeAll(function() {
    // setup a new optimizer site page object
    browser.DZoneSite = new DZoneSite(browser);
  });

  it('Test Angular Site optimizer', function () {
    browser.reportingClient.testStep('Step 1: navigate DZone site');
    browser.DZoneSite.init();

    browser.reportingClient.testStep('Step 2: login');
    browser.DZoneSite.login();
    
    browser.reportingClient.testStep('Step 3: navigate to portals');
    browser.DZoneSite.getZonesPortal();

    browser.reportingClient.testStep('Step 4: navigate to agile portal and assert header');
    browser.DZoneSite.getPortal('Agile');
    let title_path = '//*[@class =\'col-md-12 pageHeadline3 pageHeadline oUhb_VWOdbfWVcC ng-scope\']/h1'
    let actual_header = browser.findElement(by.xpath(title_path)).getText();
    expect(actual_header).toEqual('Agile methodology news, tutorials & tools');

    browser.reportingClient.testStep('Step 5: validate the date');
    let actual_date = browser.DZoneSite.getPortalDate();
    expect(actual_date).toEqual('Tuesday, January 24'); // Change this to the expected date value 
  });

});
