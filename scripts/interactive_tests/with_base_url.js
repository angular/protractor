const env = require('../../spec/environment.js');
const InteractiveTest = require('./interactive_test_util');
const port = env.interactiveTestPort;
const test = new InteractiveTest(
    'node built/cli.js --baseUrl http://localhost:' + env.webServerDefaultPort +
    '/ng1 --elementExplorer true', port);

// Check we automatically go to to baseUrl.
test.addCommandExpectation(
    'browser.driver.getCurrentUrl()',
    'http://localhost:' + env.webServerDefaultPort + 'asdasd/asdng1/#/form');
test.run().then();
