exports.postTest = function(passed, testInfo) {
  if (passed !== true) {
    this.addFailure('`passed` should have been `true`, but got `' +
        JSON.stringify(passed) + '`');
  } else {
    this.addSuccess();
  }
  if (testInfo.name !== 'name') {
    this.addFailure('`testInfo.name` should have been `"name"`, but got `' +
        JSON.stringify(testInfo.name) + '`');
  } else {
    this.addSuccess();
  }
  if (testInfo.category !== 'category') {
    this.addFailure('`testInfo.category` should have been `"category"`, but ' +
        'got `' + JSON.stringify(testInfo.category) + '`');
  } else {
    this.addSuccess();
  }
};
