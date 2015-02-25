var q = require('q');

var failingResult = function(message) {
  return {
    failedCount: 1,
    specResults: [{
      description: 'plugin test which fails',
      assertions: [{
        passed: false,
        errorMsg: message,
      }],
      duration: 4
    }]
  };
};

module.exports = {
  setup: function() {
    return q.delay(100).then(function() {
      return failingResult('from setup');
    });
  },

  teardown: function() {
    return q.delay(100).then(function() {
      return failingResult('from teardown');
    });
  },

  postResults: function() {
    // This function should cause no failures.
  },

  postTest: function(config, passed) {
    return q.delay(100).then(function() {
      return failingResult('from postTest ' + (passed ? 'passing' : 'failing'));
    });
  }
};
