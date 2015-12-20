describe('Step 1 from step suite', function() {
  it('should go to AngularJS homepage', function() {
	browser.get('http://www.angularjs.org');
	
	expect(browser.getCurrentUrl()).toBe('https://www.angularjs.org/');
  });
});