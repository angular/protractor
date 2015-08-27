var q = require('q'),
    fs = require('fs'),
    path = require('path'),
    _ = require('lodash');
    request = require('request'),
    Entities = require('html-entities').XmlEntities;

/**
 * You can audit your website against the Chrome Accessibility Developer Tools,
 * Tenon.io, or both by enabling this plugin in your config file:
 *
 *    // Chrome Accessibility Developer Tools:
 *    exports.config = {
 *      ...
 *      plugins: [{
 *        chromeA11YDevTools: {
 *          treatWarningsAsFailures: true
 *        },
 *        path: 'node_modules/protractor.plugins/accessiblity'
 *      }]
 *    }
 *
 *    // Tenon.io:
 *
 *    //  Read about the Tenon.io settings and API requirements:
 *    //  -http://tenon.io/documentation/overview.php
 *
 *    exports.config = {
 *      ...
 *      plugins: [{
 *        tenonIO: {
 *          options: {
 *            // See http://tenon.io/documentation/understanding-request-parameters.php
 *            // options.src will be added by the test.
 *          },
 *          printAll: false, // whether the plugin should log API response
 *        },
 *        chromeA11YDevTools: false,
 *        path: 'node_modules/protractor/plugins/accessiblity'
 *      }]
 *    }
 *
 */

var AUDIT_FILE = require.resolve('accessibility-developer-tools/dist/js/axs_testing.js');
var TENON_URL = 'http://www.tenon.io/api/';

/**
 * Checks the information returned by the accessibility audit(s) and
 * displays passed/failed results as console output.
 *
 * @this {Object} The plugin context object
 * @return {q.Promise} A promise which resolves when all audits are finished
 * @public
 */
function teardown() {

  var audits = [];

  if (this.config.chromeA11YDevTools) {
    audits.push(runChromeDevTools(this));
  }
  // check for Tenon config and an actual API key, not the placeholder
  if (this.config.tenonIO && /[A-Za-z][0-9]/.test(
      this.config.tenonIO.options.key)) {
    audits.push(runTenonIO(this));
  }
  return q.all(audits);
}

var entities = new Entities();

/**
 * Audits page source against the Tenon API, if configured. Requires an API key:
 * more information about licensing and configuration available at
 * http://tenon.io/documentation/overview.php.
 *
 * @param {Object} context The plugin context object
 * @return {q.Promise} A promise which resolves when the audit is finished
 * @private
 */
function runTenonIO(context) {

  return browser.driver.getPageSource().then(function(source) {

    var options = _.assign(context.config.tenonIO.options, {src: source});

    // setup response as a deferred promise
    var deferred = q.defer();
    request.post({
      url: TENON_URL,
      form: options
    },
    function(err, httpResponse, body) {
      if (err) { return resolve.reject(new Error(err)); }
      else { return deferred.resolve(JSON.parse(body)); }
    });

    return deferred.promise.then(function(response) {
      return processTenonResults(response);
    });
  });

  function processTenonResults(response) {

    var testHeader = 'Tenon.io - ';

    if (!response.resultSet) {
      if (response.code === 'daily_limit_reached') {
        console.log(testHeader, 'Daily limit reached');
        console.log(response.moreInfo);
      }
      else {
        console.log('Tenon.io error');
      }
      return;
    }

    var numResults = response.resultSet.length;

    if (numResults === 0) {
      context.addSuccess();
      return;
    }

    if (context.config.tenonIO.printAll) {
      console.log('\x1b[32m', testHeader + 'API response', '\x1b[39m');
      console.log(response);
    }

    return response.resultSet.forEach(function(result) {
      var ref = (result.ref === null) ? '' : result.ref;

      context.addFailure(result.errorDescription + '\n\n' +
          '\t\t' +entities.decode(result.errorSnippet) +
          '\n\n\t\t' + ref, {specName: testHeader + result.errorTitle});
    });
  }
}

/**
 * Audits page source against the Chrome Accessibility Developer Tools, if configured.
 *
 * @param {Object} context The plugin context object
 * @return {q.Promise} A promise which resolves when the audit is finished
 * @private
 */
function runChromeDevTools(context) {

  var data = fs.readFileSync(AUDIT_FILE, 'utf-8');
  data = data + ' return axs.Audit.run();';

  var elementPromises = [],
      elementStringLength = 200;

  function trimText(text) {
    if (text.length > elementStringLength) {
      return text.substring(0, elementStringLength / 2) + ' ... '
          + text.substring(text.length - elementStringLength / 2);
    } else {
      return text;
    }
  }

  var testHeader = 'Chrome A11Y - ';

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
                list: trimText(text)
              };
            },
            function(reason){
              return {
                code: result.rule.code,
                list: reason
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

      return audit.forEach(function(result, index) {
        if (result.result === 'FAIL') {
          var label = result.elementCount === 1 ? ' element ' : ' elements ';
          if (result.rule.severity !== 'Warning'
              || context.config.chromeA11YDevTools.treatWarningsAsFailures) {
            result.warning = false;
          } else {
            result.warning = true;
            result.rule.heading = '\x1b[33m(WARNING) '
                + result.rule.heading + ' (' + result.elementCount
                + label + 'failed)';
          }
          result.output = '\n\t\t' + result.elementCount + label + 'failed:';

          // match elements returned via promises
          // by their failure codes
          elementFailures.forEach(function(element, index) {
            if (element.code === result.rule.code) {
              result.output += '\n\t\t' + elementFailures[index].list;
            }
          });
          result.output += '\n\n\t\t' + result.rule.url;
          (result.warning ? context.addWarning : context.addFailure)(
              result.output, {specName: testHeader + result.rule.heading});
        }
        else {
          context.addSuccess({specName: testHeader + result.rule.heading});
        }
      });
    });
  });
}

// Export
exports.teardown = teardown;
