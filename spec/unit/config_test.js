var ConfigParser = require('../../lib/configParser');
var path = require('path'),
  Q = require('q');

describe('the config parser', function() {

  it('should have a default config', function(done) {
    var config = new ConfigParser().getConfig().then(function(config){
      expect(config.specs).toEqual([]);
      expect(config.rootElement).toEqual('body');
      done();
    });
  });

  it('should merge in config from an object', function(done) {
    var toAdd = {
      rootElement: '.mydiv'
    }
    var config = new ConfigParser().addConfig(toAdd).getConfig().then(function(config){
      expect(config.specs).toEqual([]);
      expect(config.rootElement).toEqual('.mydiv');
      done();
    });
  });

  it('should merge in config from a file', function(done) {
    var config = new ConfigParser().
        addFileConfig(__dirname + '/data/config.js').
        getConfig().
        then(function(config){
          expect(config.rootElement).toEqual('.mycontainer');
          expect(config.onPrepare.indexOf(path.normalize('/spec/unit/data/foo/bar.js'))).not.toEqual(-1);
          expect(config.specs.length).toEqual(1);
          expect(config.specs[0]).toEqual('fakespec*.js');
          done();
        });
  });

  it('should keep filepaths relative to the cwd when merging', function(done) {
    var toAdd = {
      onPrepare: 'baz/qux.js'
    }

    var config = new ConfigParser().addConfig(toAdd).getConfig().then(function(config){
      expect(config.onPrepare).toEqual(path.normalize(process.cwd() + '/baz/qux.js'));
      done();
    });
  });

  describe('resolving globs', function() {
    it('should resolve relative to the cwd', function(done) {
      var toAdd = {
        specs: 'data/*spec*.js'
      }
      var config = new ConfigParser().addConfig(toAdd).getConfig().then(function(config){
        spyOn(process, 'cwd').andReturn(__dirname + '/');
        var specs = ConfigParser.resolveFilePatterns(config.specs);
        expect(specs.length).toEqual(2);
        expect(specs[0].indexOf(path.normalize('unit/data/fakespecA.js'))).not.toEqual(-1);
        expect(specs[1].indexOf(path.normalize('unit/data/fakespecB.js'))).not.toEqual(-1);
        done();
      });
    });

    it('should resolve relative to the config file dir', function(done) {
      var config = new ConfigParser().
          addFileConfig(__dirname + '/data/config.js').
          getConfig().then(function(config){
            var specs = ConfigParser.resolveFilePatterns(config.specs, false, config.configDir);
            expect(specs.length).toEqual(2);
            expect(specs[0].indexOf(path.normalize('unit/data/fakespecA.js'))).not.toEqual(-1);
            expect(specs[1].indexOf(path.normalize('unit/data/fakespecB.js'))).not.toEqual(-1);
            done();
          });
    });
  });

  describe('with promises', function() {

    it('should merge in config from an object', function(done) {
      var toAdd = Q({
        rootElement: '.mydiv'
      }).delay(1);

      var config = new ConfigParser().addConfig(toAdd).getConfig().then(function(config){
        expect(config.specs).toEqual([]);
        expect(config.rootElement).toEqual('.mydiv');
        done();
      });
    });

    it('should merge in config from a file', function(done) {
      var config = new ConfigParser().
          addFileConfig(__dirname + '/data/config.promise.js').
          getConfig().
          then(function(config){
            expect(config.rootElement).toEqual('.mycontainer');
            expect(config.onPrepare.indexOf(path.normalize('/spec/unit/data/foo/bar.js'))).not.toEqual(-1);
            expect(config.specs.length).toEqual(1);
            expect(config.specs[0]).toEqual('fakespec*.js');
            done();
          });
    });

    it('should keep filepaths relative to the cwd when merging', function(done) {
      var toAdd = Q({
        onPrepare: 'baz/qux.js'
      }).delay(100);

      var config = new ConfigParser().addConfig(toAdd).getConfig().then(function(config){
        expect(config.onPrepare).toEqual(path.normalize(process.cwd() + '/baz/qux.js'));
        done();
      });
    });

    describe('resolving globs', function() {
      it('should resolve relative to the cwd', function(done) {
        var toAdd = Q({
          specs: 'data/*spec*.js'
        }).delay(10);

        var config = new ConfigParser().addConfig(toAdd).getConfig().then(function(config){
          var specs = ConfigParser.resolveFilePatterns(config.specs, false, __dirname + '/');
          expect(specs.length).toEqual(2);
          expect(specs[0].indexOf(path.normalize('unit/data/fakespecA.js'))).not.toEqual(-1);
          expect(specs[1].indexOf(path.normalize('unit/data/fakespecB.js'))).not.toEqual(-1);
          done();
        });
      });

      it('should resolve relative to the config file dir', function(done) {
        var config = new ConfigParser().
            addFileConfig(__dirname + '/data/config.promise.js').
            getConfig();
        config.then(function(config){
          var specs = ConfigParser.resolveFilePatterns(
            config.specs, false, config.configDir);
          expect(specs.length).toEqual(2);
          expect(specs[0].indexOf(path.normalize('unit/data/fakespecA.js'))).not.toEqual(-1);
          expect(specs[1].indexOf(path.normalize('unit/data/fakespecB.js'))).not.toEqual(-1);
          done();
        });
      });
    });
  });
});
