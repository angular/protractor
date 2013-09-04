var util = require('util');

describe('synchronizing with slow pages', function() {
  var ptor = protractor.getInstance();

  beforeEach(function() {
    ptor.get('app/index.html#/async');
  });

  it('waits for http calls', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowHttpStatus'));
    var button = ptor.findElement(protractor.By.css('[ng-click="slowHttp()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for long javascript execution', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowFunctionStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowFunction()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('DOES NOT wait for timeout', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowTimeoutStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('pending...');
  });

  it('waits for $timeout', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowAngularTimeoutStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowAngularTimeout()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for $timeout then a promise', function() {
    var status =
      ptor.findElement(protractor.By.binding(
          'slowAngularTimeoutPromiseStatus'));
    var button =
      ptor.findElement(protractor.By.css(
          '[ng-click="slowAngularTimeoutPromise()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });

  it('waits for long http call then a promise', function() {
    var status =
      ptor.findElement(protractor.By.binding('slowHttpPromiseStatus'));
    var button =
      ptor.findElement(protractor.By.css('[ng-click="slowHttpPromise()"]'));

    expect(status.getText()).toEqual('not started');

    button.click();

    expect(status.getText()).toEqual('done');
  });
});
