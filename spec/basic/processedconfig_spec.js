var util = require('util');

describe('configuration elements', function() {
  it('should have access to the processed config block', function() {
    browser.getProcessedConfig().then(function(config) {
      expect(config.capabilities.browserName).toEqual('chrome');
      expect(config.capabilities.version).toEqual('ANY');
      expect(config.params.login.name).toEqual('Jane');
    });
  });
});
