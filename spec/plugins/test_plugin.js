module.exports = {
  teardown: function() {
    return {
      failedCount: 0,
      specResults: [{
        description: 'This succeeds',
        assertions: [],
        duration: 1
      }]
    };
  }
};
