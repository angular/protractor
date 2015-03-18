var q = require('q');

var passingResult = {
  failedCount: 0,
  specResults: [{
    description: 'plugin test which passes',
    assertions: [],
    duration: 4
  }]
};

module.exports = {
  setup: function() {
    return q.delay(100).then(function() {
      return passingResult;
    });
  },

  teardown: function() {
    return q.delay(100).then(function() {
      return passingResult;
    });
  },

  postResults: function() {
    // This function should cause no failures.
  },

  postTest: function() {
    return q.delay(100).then(function() {
      return passingResult;
    });
  },

  name: 'some plugin name'
};
