describe('angular material checkboxes page', function() {
  it('should click on checkbox', function() {
    browser.get('https://material.angular.io/components/checkbox/overview');

    element(by.checkboxText('Check me!')).click();

    expect($('.mat-checkbox-input').getAttribute('aria-checked')).toEqual('true');
  });
});
