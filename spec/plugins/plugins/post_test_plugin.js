exports.postTest = function(config, passed, testInfo) {
  var nameCorrect = testInfo.name == 'name';
  var categoryCorrect = testInfo.category == 'category';
  return {
    failedCount: passed && nameCorrect && categoryCorrect ? 0 : 1,
    specResults: [{
      description: 'make sure postTest passed correct information',
      assertions: [{
        passed: passed,
        errorMsg: passed ? undefined : '`passed` should have been `true`, but' +
            ' got `' + JSON.stringify(passed) + '`'
      }, {
        passed: nameCorrect,
        errorMsg: nameCorrect ? undefined : '`testInfo.name` should have been' +
            ' `"name"`, but got `' + JSON.stringify(testInfo.name) + '`'
      }, {
        passed: categoryCorrect,
        errorMsg: categoryCorrect ? undefined : '`testInfo.category` should ' +
            'have been `"category"`, but got `' +
            JSON.stringify(testInfo.category) + '`'
      }],
      duration: 0
    }]
  };
};
