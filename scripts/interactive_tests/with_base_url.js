var InteractiveTest = require('./interactive_test_util').InteractiveTest;
var port = 6969;
var test = new InteractiveTest(
    'node lib/cli.js --baseUrl http://localhost:8081 --elementExplorer true', 
    port);

// Check we automatically go to to baseUrl.
test.addCommandExpectation('browser.driver.getCurrentUrl()', 'http://localhost:8081/#/form');
test.run();
