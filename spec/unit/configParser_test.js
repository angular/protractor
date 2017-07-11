var ConfigParser = require('../../built/configParser').ConfigParser;
var ConfigError = require('../../built/exitCodes').ConfigError;
var ProtractorError = require('../../built/exitCodes').ProtractorError;
var Logger = require('../../built/logger').Logger;
var WriteTo = require('../../built/logger').WriteTo;
var path = require('path');

describe('the config parser', function() {
  describe('exceptions', function() {

    beforeAll(function() {
      ProtractorError.SUPRESS_EXIT_CODE = true;
      Logger.writeTo = WriteTo.NONE;
    });

    afterAll(function() {
      ProtractorError.SUPRESS_EXIT_CODE = false;
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
        expect(err.stack).toMatch('Cannot find module');
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
        expect(err.stack).toMatch('did not export a config object');
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
        expect(err.stack).toMatch('Unknown test suite: foo.js');
      }
      expect(errorFound).toBe(true);
    });
  });

  it('should have a default config', function() {
    var config = new ConfigParser().getConfig();
    expect(config.specs).toEqual([]);
    expect(config.rootElement).toEqual('');
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
    expect(config.onPrepare.indexOf(
      path.normalize('/spec/unit/data/foo/bar.js'))).not.toEqual(-1);
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
    it(`should return all the specs from "config.suites" if no other sources
        are provided`, function() {
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

    it('should not try to expand non-glob patterns', function() {
      var toAdd = {
        specs: 'data/fakespecA.js:5'
      };
      var config = new ConfigParser().addConfig(toAdd).getConfig();
      var specs = ConfigParser.resolveFilePatterns(config.specs);
      expect(specs.length).toEqual(1);
      expect(specs[0].indexOf(path.normalize('data/fakespecA.js:5'))).not.toEqual(-1);
    });
  });
});
