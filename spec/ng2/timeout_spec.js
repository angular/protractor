describe('async angular2 application timeout', function() {
  var URL = '/ng2/#/async';

  it('should timeout if intervals are used in the NgZone', function() {
    browser.get(URL);
    var timeout = $('#periodicIncrement');
    timeout.$('.action').click();
    timeout.$('.cancel').click();
  });
});
