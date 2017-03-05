# Protractor + Jasmine Angular Web Sample
The project demonstrates using [Protractor](http://www.protractortest.org/#/) and [Jasmine](http://jasmine.github.io/) in Perfecto Lab.

:information_source: Click [here](https://community.perfectomobile.com/series/27942) for a guide to get started with Protractor.

## Getting started
Install NodeJS dependencies with this command:

> npm install

:information_source: The test requires a user for Dzone portal. <br/>
Create one and update the credentials n [spec.js](Dzone.js) : <br/>
```JavaScript
    browser.findElement(by.name('username')).sendKeys('MyDzoneUser');
    browser.findElement(by.name('password')).sendKeys('MyDzonePass');
```

## Running the test
- Update your Perfecto credentials in [conf.js](conf.js).
- Update the date assertion in [spec.js](spec.js) to the curret day (Keep the same date's format).

You can run [spec.js](spec.js) with this command:

> npm test

## Reporting 
A [custom Jasmine reporter](http://jasmine.github.io/2.4/custom_reporter.html) in configured in conf.js.

This reporter automatically reports the start and end of test executions, 
to provide seamless integration and remove boilerplate code from your test scripts.

Test scripts can then be enriched with reporting of functional test steps by using 
> browser.reportingClient.testStep('Step description comes here');

