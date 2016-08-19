module.exports = {
  setup: function() {
    protractor.__BASIC_PLUGIN_RAN_SETUP = true;
  },
  onPrepare: function() {
    protractor.__BASIC_PLUGIN_RAN_ON_PREPARE = true;
  }
};
