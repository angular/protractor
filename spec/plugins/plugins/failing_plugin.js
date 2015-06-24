var q = require('q');

module.exports = {
  setup: function() {
    var self = this;
    return q.delay(100).then(function() {
      self.addFailure('from setup');
    });
  },

  teardown: function() {
    var self = this;
    return q.delay(100).then(function() {
      self.addFailure('from teardown');
    });
  },

  postResults: function() {
    // This function should cause no failures.
  },

  postTest: function(passed) {
    var self = this;
    return q.delay(100).then(function() {
      self.addFailure('from postTest ' + (passed ? 'passing' : 'failing'));
    });
  }
};
