var Runner = require('../../lib/runner');
var q = require('q');

describe('the Protractor runner', function() {
  var mockDriverProvider;

  beforeEach(function() {
    mockDriverProvider = jasmine.createSpyObj(
        'mockDriverProvider',
        ['setupEnv', 'teardownEnv', 'getDriver']);

    mockDriverProvider.setupEnv.andCallFake(function() {
      return q.fcall(function() {});
    });

    mockDriverProvider.teardownEnv.andCallFake(function() {
      return q.fcall(function() {});
    });

    mockDriverProvider.getDriver.andReturn({
      // A fake driver.
      manage: function() {
        return {
          timeouts: function() {
            return {
              setScriptTimeout: function() {}
            };
          }
        };
      }
    });
  });

  it('should export its config', function() {
    var config = {
      foo: 'bar',
    };

    var runner = new Runner(config);

    expect(runner.getConfig()).toEqual(config);
  });

  it('should run', function(done) {
    var config = {
      specs: ['*.js'],
      framework: 'simpleprint'
    };
    var exitCode;
    Runner.prototype.loadDriverProvider_ = function() {
      this.driverprovider_ = mockDriverProvider;
    };
    Runner.prototype.exit_ = function(exit) {
      exitCode = exit;
    };
    var runner = new Runner(config);

    runner.run().then(function() {
      expect(mockDriverProvider.setupEnv).toHaveBeenCalled();
      expect(mockDriverProvider.teardownEnv).toHaveBeenCalled();
      expect(exitCode).toEqual(0);
      done();
    });
  });

  it('should fail with no specs', function() {
    var config = {
      specs: [],
      framework: 'simpleprint'
    };
    var exitCode;
    Runner.prototype.loadDriverProvider_ = function() {
      this.driverprovider_ = mockDriverProvider;
    };
    Runner.prototype.exit_ = function(exit) {
      exitCode = exit;
    };
    var runner = new Runner(config);

    expect(function() {
      runner.run()
    }).toThrow();
  });
});
