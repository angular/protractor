var q = require('q'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');

/**
 * You can enable this plugin in your config file:
 *
 *    // The Chrome Accessibility Developer Tools are currently
 *    // the only integration option.
 *
 *    exports.config = {
 *      ...
 *      plugins: [{
 *        chromeA11YDevTools: true,
 *        path: 'node_modules/protractor.plugins/accessiblity'
 *      }]
 *    }
 *
 */

var AUDIT_FILE = path.join(__dirname, '../../node_modules/accessibility-developer-tools/dist/js/axs_testing.js');

/**
 * Checks the information returned by the accessibility audit and
 * displays passed/failed results as console output.
 *
 * @param {Object} config The configuration file for the accessibility plugin
 * @return {q.Promise} A promise which resolves to the results of any passed or
 *    failed tests
 * @public
 */
function teardown(config) {

  if (config.chromeA11YDevTools) {

    var data = fs.readFileSync(AUDIT_FILE, 'utf-8');
    data = data + ' return axs.Audit.run();';

    var testOut = {failedCount: 0, specResults: []},
        elementPromises = [];

    return browser.executeScript_(data, 'a11y developer tool rules').then(function(results) {

      var audit = results.map(function(result) {
        var DOMElements = result.elements;
        if (DOMElements !== undefined) {

          DOMElements.forEach(function(elem) {
            // get elements from WebDriver, add to promises array
            elementPromises.push(
              elem.getOuterHtml().then(function(text) {
                return {
                  code: result.rule.code,
                  list: text
                };
              })
            );
          });
          result.elementCount = DOMElements.length;
        }
        return result;
      });

      // Wait for element names to be fetched
      return q.all(elementPromises).then(function(elementFailures) {

        audit.forEach(function(result, index) {
          if (result.result === 'FAIL') {
            result.passed = false;
            testOut.failedCount++;

            var label = result.elementCount === 1 ? ' element ' : ' elements ';
            result.output = '\n\t\t' + result.elementCount + label + 'failed:';

            // match elements returned via promises
            // by their failure codes
            elementFailures.forEach(function(element, index) {
              if (element.code === result.rule.code) {
                result.output += '\n\t\t' + elementFailures[index].list;
              }
            });
            result.output += '\n\n\t\t' + result.rule.url;
          }
          else {
            result.passed = true;
            result.output = '';
          }

          testOut.specResults.push({
            description: result.rule.heading,
            assertions: [{
              passed: result.passed,
              errorMsg: result.output
            }],
            duration: 1
          });
        });

        if ((testOut.failedCount > 0) || (testOut.specResults.length > 0)) {
          return testOut;
        }
      });
    });
  }
}

// Export
exports.teardown = teardown;
