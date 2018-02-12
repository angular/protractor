var fs = require('fs'),
    os = require('os'),
    path = require('path');
var LogLevel = require('../../built/logger').LogLevel,
    Logger = require('../../built/logger').Logger,
    WriteTo = require('../../built/logger').WriteTo;

describe('the logger', function() {
  var logFile = path.resolve(os.tmpdir(), 'logger_test.log');
  var logger = new Logger('FooBar');

  beforeEach(function() {
    try { fs.unlinkSync(path.resolve(logFile)); } catch(e) { }
  });

  afterEach(function() {
    try { fs.unlinkSync(path.resolve(logFile)); } catch(e) { }
  });

  describe('log strings to file', function() {
    beforeEach(function() {
      Logger.setWrite(WriteTo.FILE, logFile);
    });

    var writeString = function() {
      logger.debug('hello debug');
      logger.info('hello info');
      logger.warn('hello warn');
      logger.error('hello error');
    };

    afterEach(function() {
      Logger.setWrite(WriteTo.CONSOLE);
      Logger.logLevel = LogLevel.DEBUG;
    });

    it('should write debug, info, warn, and error to file', function() {
      Logger.logLevel = LogLevel.DEBUG;
      writeString();
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(6);
      expect(linesSplit[1]).toContain('D/FooBar');
      expect(linesSplit[2]).toContain('I/FooBar');
      expect(linesSplit[3]).toContain('W/FooBar');
      expect(linesSplit[4]).toContain('E/FooBar');
    });

    it('should write info, warn, and error to file', function() {
      Logger.logLevel = LogLevel.INFO;
      writeString();
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(5);
      expect(linesSplit[1]).toContain('I/FooBar');
      expect(linesSplit[2]).toContain('W/FooBar');
      expect(linesSplit[3]).toContain('E/FooBar');
    });

    it('should write warn and error to file', function() {
      Logger.logLevel = LogLevel.WARN;
      writeString();
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(4);
      expect(linesSplit[1]).toContain('W/FooBar');
      expect(linesSplit[2]).toContain('E/FooBar');
    });

    it('should write error to file', function() {
      Logger.logLevel = LogLevel.ERROR;
      writeString();
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('E/FooBar');
    });
  });

  describe('log json objects/array to file', function() {
    beforeEach(function() {
      Logger.setWrite(WriteTo.FILE, logFile);
    });

    afterEach(function() {
      Logger.setWrite(WriteTo.CONSOLE);
    });

    it('should write obj to file', function() {
      var obj = { foo: 'bar' };
      logger.info(obj);
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('{"foo":"bar"}');
    });

    it('should write an array to file', function() {
      var arr = [ 'foo', 'bar', 'foobar' ];
      logger.info(arr);
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('["foo","bar","foobar"]');
    });
  });

  describe('log different types', function() {
    beforeEach(function() {
      Logger.setWrite(WriteTo.FILE, logFile);
    });

    afterEach(function() {
      Logger.setWrite(WriteTo.CONSOLE);
    });

    it('should write json objects and strings', function() {
      var obj = { foo: 'bar' };
      var arr = [ 'foo', 'bar', 'foobar' ];
      var msg = 'foobar';
      logger.info(obj, arr, msg);
      var lines = fs.readFileSync(path.resolve(logFile)).toString();
      var linesSplit = lines.split('\n');
      expect(linesSplit.length).toBe(3);
      expect(linesSplit[1]).toContain('{"foo":"bar"} ["foo","bar","foobar"] foobar');
    });
  });

  describe('default log level is configurable', function () {
    beforeEach(function() {
      Logger.logLevel = LogLevel.ERROR;
    });

    afterEach(function() {
      Logger.logLevel = LogLevel.DEBUG;
    });

    it('should be configurable statically', function () {
      Logger.logLevel = LogLevel.WARN;
      expect(Logger.logLevel).toBe(LogLevel.WARN);
    });

    it('should be configurable with "troubleshoot" property', function () {
      Logger.set({ troubleshoot: true });
      expect(Logger.logLevel).toBe(LogLevel.DEBUG);
    });

    it('should be configurable with "logLevel" property', function () {
      Logger.set({ logLevel: 'WARN' });
      expect(Logger.logLevel).toBe(LogLevel.WARN);
    });
  });
});
