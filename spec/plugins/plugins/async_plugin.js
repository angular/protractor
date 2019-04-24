module.exports = {
  setup: async function() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    this.addSuccess();
  },

  teardown: async function() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    this.addSuccess();
  },

  postResults: function() {
    // This function should cause no failures.
  },

  postTest: async function() {
    await new Promise(resolve => {
      setTimeout(resolve, 100);
    });
    this.addSuccess();
  },

  name: 'some plugin name'
};
