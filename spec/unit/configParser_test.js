var ConfigParser = require('../../built/configParser').ConfigParser;
var ConfigError = require('../../built/exitCodes').ConfigError;
var Logger = require('../../built/logger2').Logger;
var WriteTo = require('../../built/logger2').WriteTo;
var path = require('path');

describe('the config parser', function() {
  describe('exceptions', function() {

    beforeEach(function() {
      Logger.writeTo = WriteTo.NONE;
    });

    afterEach(function() {
      Logger.writeTo = WriteTo.CONSOLE;
    });

    it('should throw an error if the file is not found', function() {
      var config = new ConfigParser();
      var errorFound = false;
      try {
        config.addFileConfig('foobar.js');
      } catch (err) {
        errorFound = true;
        expect(err.code).toEqual(ConfigError.CODE);
      }
      expect(errorFound).toBe(true);
    });

    it('should throw an error if the file does not have export config', function() {
      var config = new ConfigParser();
      var errorFound = false;
      try {
        config.addFileConfig(path.resolve('./spec/environment.js'));
      } catch (err) {
        errorFound = true;
        expect(err.code).toEqual(ConfigError.CODE);
      }
      expect(errorFound).toBe(true);
    });

    it('should throw an error when the spec file does not resolve', function() {
      var errorFound = false;
      try {
        var config = {
          suite:'foo.js,bar.js'
        };
        ConfigParser.getSpecs(config);
      } catch (err) {
        errorFound = true;
        expect(err.code).toEqual(ConfigError.CODE);
      }
      expect(errorFound).toBe(true);
    });
  });

  it('should have a default config', function() {
    var config = new ConfigParser().getConfig();
    expect(config.specs).toEqual([]);
    expect(config.rootElement).toEqual('body');
  });

  it('should merge in config from an object', function() {
    var toAdd = {
      rootElement: '.mydiv'
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    expect(config.specs).toEqual([]);
    expect(config.rootElement).toEqual('.mydiv');
  });

  it('should merge in config from a file', function() {
    var config = new ConfigParser().
        addFileConfig(__dirname + '/data/config.js').
        getConfig();

    expect(config.rootElement).toEqual('.mycontainer');
    expect(config.onPrepare.indexOf(path.normalize('/spec/unit/data/foo/bar.js'))).not.toEqual(-1);
    expect(config.specs.length).toEqual(1);
    expect(config.specs[0]).toEqual('fakespec[AB].js');
  });

  it('should keep filepaths relative to the cwd when merging', function() {
    var toAdd = {
      onPrepare: 'baz/qux.js'
    };

    var config = new ConfigParser().addConfig(toAdd).getConfig();

    expect(config.onPrepare).toEqual(path.normalize(process.cwd() + '/baz/qux.js'));
  });

  describe('getSpecs()', function() {
    it('should return all the specs from "config.suites" if no other sources are provided', function() {
      var config = {
        specs: [],
        suites: {
          foo: 'foo.spec.js',
          bar: 'bar.spec.js'
        }
      };

      var specs = ConfigParser.getSpecs(config);

      expect(specs).toEqual(['foo.spec.js', 'bar.spec.js']);
    });
  });

  describe('resolving globs', function() {
    it('should resolve relative to the cwd', function() {
      spyOn(process, 'cwd').and.returnValue(__dirname + '/');
      var toAdd = {
        specs: 'data/*spec[AB].js'
      };
      var config = new ConfigParser().addConfig(toAdd).getConfig();
      var specs = ConfigParser.resolveFilePatterns(config.specs);
      expect(specs.length).toEqual(2);
      expect(specs[0].indexOf(path.normalize('unit/data/fakespecA.js'))).not.toEqual(-1);
      expect(specs[1].indexOf(path.normalize('unit/data/fakespecB.js'))).not.toEqual(-1);
    });

    it('should resolve relative to the config file dir', function() {
      var config = new ConfigParser().
          addFileConfig(__dirname + '/data/config.js').
          getConfig();
      var specs = ConfigParser.resolveFilePatterns(
          config.specs, false, config.configDir);
      expect(specs.length).toEqual(2);
      expect(specs[0].indexOf(path.normalize('unit/data/fakespecA.js'))).not.toEqual(-1);
      expect(specs[1].indexOf(path.normalize('unit/data/fakespecB.js'))).not.toEqual(-1);
    });
  });
});
