var q = require('q');

var testOut = {failedCount: 0, specResults: []};

var ConsolePlugin = function () {
    this.failOnWarning = false;
    this.failOnError = true;
};

ConsolePlugin.getBrowserLog = function () {
    return browser.manage().logs().get('browser');
};

ConsolePlugin.logMessages = function (warnings, errors) {
    warnings.map(function (warning) {
        console.error(warning.level.name + ': ' + warning.message);
    });

    errors.map(function (error) {
        console.error(error.level.name + ': ' + error.message);
    });
};

ConsolePlugin.parseLog = function (config) {
    var self = this;
    var deferred = q.defer();
    var failOnWarning = config.failOnWarning || this.failOnWarning;
    var failOnError = config.failOnError || this.failOnError;
    this.getBrowserLog().then(function (log) {

        var warnings = log.filter(function (node) {
            return (node.level || {}).name === 'WARNING';
        });

        var errors = log.filter(function (node) {
            return (node.level || {}).name === 'SEVERE';
        });

        if (warnings.length > 0 || errors.length > 0) {
            self.logMessages(warnings, errors);
        }

        testOut.failedCount += (warnings.length > 0 && failOnWarning) ? 1 : 0;
        testOut.failedCount += (errors.length > 0 && failOnError) ? 1 : 0;

        deferred.resolve();
    });

    return deferred.promise;
};

ConsolePlugin.prototype.postTest = function (config, passed) {

};

ConsolePlugin.prototype.teardown = function (config) {
    var audits = [];

    audits.push(ConsolePlugin.parseLog(config));

    return q.all(audits).then(function (result) {
        return testOut;
    });
};

ConsolePlugin.prototype.postResults = function (config) {

};

var consolePlugin = new ConsolePlugin();

exports.teardown = consolePlugin.teardown.bind(consolePlugin);
exports.postResults = consolePlugin.postResults.bind(consolePlugin);
exports.postTest = consolePlugin.postTest.bind(consolePlugin);

exports.ConsolePlugin = ConsolePlugin;

exports.name = '';