var InteractiveTest = require('./interactive_test_util').InteractiveTest;
var port = 6969;
var test = new InteractiveTest('node lib/cli.js --elementExplorer true', port);

// Check state persists.
test.addCommandExpectation('var x = 3');
test.addCommandExpectation('x', '3'); 

// Check can return functions.
test.addCommandExpectation('var y = function(param) {return param;}');
test.addCommandExpectation('y', 'function (param) {return param;}'); 

// Check promises complete.
test.addCommandExpectation('browser.driver.getCurrentUrl()', 'data:,');
test.addCommandExpectation('browser.get("http://localhost:8081")');
test.addCommandExpectation('browser.getCurrentUrl()', 
    'http://localhost:8081/#/form'); 

// Check promises are resolved before being returned.
test.addCommandExpectation('var greetings = element(by.binding("greeting"))');
test.addCommandExpectation('greetings.getText()', 'Hiya');

// Check require is injected.
test.addCommandExpectation('var q = require("q")');
test.addCommandExpectation(
    'var deferred = q.defer(); ' + 
    'setTimeout(function() {deferred.resolve(1)}, 100); ' + 
    'deferred.promise', 
    '1');

// Check errors are handled gracefully
test.addCommandExpectation('element(by.binding("nonexistent"))');
test.addCommandExpectation('element(by.binding("nonexistent")).getText()', 
    'ERROR: NoSuchElementError: No element found using locator: ' + 
    'by.binding("nonexistent")');

// Check complete calls
test.addCommandExpectation('\t', 
    '[["element(by.id(\'\'))","element(by.css(\'\'))",' + 
    '"element(by.name(\'\'))","element(by.binding(\'\'))",' + 
    '"element(by.xpath(\'\'))","element(by.tagName(\'\'))",' + 
    '"element(by.className(\'\'))"],""]');
test.addCommandExpectation('ele\t', '[["element"],"ele"]');
test.addCommandExpectation('br\t', '[["break","","browser"],"br"]');

test.run();

