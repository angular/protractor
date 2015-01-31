var ConfigParser = require('../../lib/configParser');
var path = require('path');

describe('the config parser', function() {

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

  describe('merging configs', function() {
    it('should merge two entries', function() {
      var config = new ConfigParser()
          .addConfig({key: {a1: 1.1, a2: 1.2}})
          .addConfig({key2: {b1: 2.1, b2: 2.2}})
          .getConfig();
      expect(config.key).toEqual({a1: 1.1, a2: 1.2});
      expect(config.key2).toEqual({b1: 2.1, b2: 2.2});
    });

    it('should overwrite overlapping objects', function() {
      var config = new ConfigParser()
          .addConfig({key: {a1: 1.1, a2: 1.2}})
          .addConfig({key: 1})
          .getConfig();
      expect(config.key).toEqual(1);
    });

    it('should overwrite overlapping entries within an object', function() {
      var config = new ConfigParser()
          .addConfig({key: {a1: 1.1, a2: 1.2}})
          .addConfig({key: {a1: 1}})
          .getConfig();
      expect(config.key).toEqual({a1: 1, a2: 1.2});
    });

    it('should insert entries', function() {
      var config = new ConfigParser()
          .addConfig({key: {a1: 1.1, a2: 1.2}})
          .addConfig({key: {c1: 3.1}})
          .getConfig();
      expect(config.key).toEqual({a1: 1.1, a2: 1.2, c1: 3.1});
    });

    it('should insert using array-like objects', function() {
      var config = new ConfigParser()
          .addConfig({key: []})
          .addConfig({key: {0: 'a', 1: 'b'}}) // ['a', 'b']
          .getConfig();
      expect(config.key).toEqual(['a', 'b']);
    });

    it('should replace using array-like objects', function() {
      var config = new ConfigParser()
          .addConfig({key: ['a', 'b']})
          .addConfig({key: {0: 'c', 2: 'd'}}) // ['c', undefined, 'd']
          .getConfig();
      expect(config.key).toEqual(['c', 'b', 'd']);
    });

    it('should selectively replace in a multi-layered object', function() {
      var config = new ConfigParser()
          .addConfig({key: [{'a': {'b': 1, 'c': 2}}]})
          .addConfig({key: {0: {'a': {'c': 3}}}}) // [{'a': {'c': 3}}]
          .getConfig();
      expect(config.key).toEqual([{'a': {'b': 1, 'c': 3}}]);
    });
  });
});
