var Runner = require('../../lib/runner');
var q = require('q');

describe('the Protractor runner', function() {
  it('should export its config', function() {
    var config = {
      foo: 'bar',
    };

    var runner = new Runner(config);

    expect(runner.getConfig()).toEqual(config);
  });

  it('should run', function(done) {
    var config = {
      mockSelenium: true,
      specs: ['*.js'],
      framework: 'debugprint'
    };
    var exitCode;
    Runner.prototype.exit_ = function(exit) {
      exitCode = exit;
    };
    var runner = new Runner(config);

    runner.run().then(function() {
      expect(exitCode).toEqual(0);
      done();
    });
  });

  it('should wait for promise capabilities to resolve', function(done) {
    var config = {
      mockSelenium: true,
      specs: ['*.js'],
      framework: 'debugprint',
      capabilities: q.when({
        'browserName': 'customfortest'
      })
    };
    var exitCode;
    Runner.prototype.exit_ = function(exit) {
      exitCode = exit;
    };
    var runner = new Runner(config);

    runner.run().then(function() {
      expect(runner.getConfig().capabilities.browserName).
          toEqual('customfortest');
      expect(exitCode).toEqual(0);
      done();
    });
  });

  it('should fail with no specs', function() {
    var config = {
      mockSelenium: true,
      specs: [],
      framework: 'debugprint'
    };
    var exitCode;
    Runner.prototype.exit_ = function(exit) {
      exitCode = exit;
    };
    var runner = new Runner(config);

    expect(function() {
      runner.run();
    }).toThrow();
  });
});
