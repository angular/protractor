var q = require('q');

module.exports = {
  setup: function() {
    var self = this;
    return q.delay(100).then(function() {
      self.addSuccess();
    });
  },

  teardown: function() {
    var self = this;
    return q.delay(100).then(function() {
      self.addSuccess();
    });
  },

  postResults: function() {
    // This function should cause no failures.
  },

  postTest: function() {
    var self = this;
    return q.delay(100).then(function() {
      self.addSuccess();
    });
  },

  name: 'some plugin name'
};
