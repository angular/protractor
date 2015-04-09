describe('failing each order', function() {
  it('should get each', function() {
    console.log('');
    // This fails.
    browser.get('http://localhost:8081');

    var stuffs = element.all(by.css('.rowlike'));
    stuffs.each(function(stuff) {
      var input = stuff.element(by.css('.teststuff'));
      input.getAttribute('value').then(function(value) {
        // This fails for the first value, with value='1030'
        console.log('in expect, value = ' + value);
      });
      input.sendKeys('30').then(function() {
          console.log('After sendKeys');
        });
    }).then(function() {
      console.log('Done with each');
    });
  });
});
