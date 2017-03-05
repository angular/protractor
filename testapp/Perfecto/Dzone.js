"use strict";

const domain = 'dzone.com';
var logger = console;

var DZoneSite = exports.DZoneSite = function(browser){

  this.browser = browser;

  this.init = ()=>{
    browser.driver.manage().window().maximize();
    browser.get('http://' + domain + '/');
  }

  this.login = ()=>{
    browser.findElement(by.xpath('//*[text()=\'Sign In / Join\']')).click();
    
    // Replace dzone credentials with your dzone login credentials
    browser.findElement(by.name('username')).sendKeys('MyDzoneUser');
    browser.findElement(by.name('password')).sendKeys('MyDzonePassword');

    browser.findElement(by.xpath('//*[@value=\'SIGN IN\' or @class=\'btn btn-success ng-click-active\']')).click();
  }

  this.getZonesPortal = ()=> {
    browser.findElement(by.xpath('//*[@href=\'/portals\' or @id=\'header-portals\']')).click();
    browser.findElement(by.xpath('//*[text()=\'Agile\']')).click();
  }

  this.getPortal = (portal) =>{
    browser.findElement(by.xpath('//*[text()=\'' + portal + '\']')).click();
  }

  this.getPortalDate = ()=>{
    let date = browser.findElement(by.xpath('//*[@class =\'date ng-binding\']')).getText();
    return date;
  }

}