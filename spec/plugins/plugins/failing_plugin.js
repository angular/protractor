module.exports = {
  setup: async function() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    self.addFailure('from setup');
  },

  teardown: async function() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    self.addFailure('from teardown');
  },

  postResults: function() {
    // This function should cause no failures.
  },

  postTest: async function(passed) {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    self.addFailure('from postTest ' + (passed ? 'passing' : 'failing'));
  }
};
