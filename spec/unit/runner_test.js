var Runner = require('../../built/runner').Runner;
var Logger = require('../../built/logger').Logger,
    WriteTo = require('../../built/logger').WriteTo;

describe('the Protractor runner', () => {
  beforeAll(() => {
    Logger.writeTo = WriteTo.NONE;
  });

  afterAll(() => {
    Logger.writeTo = WriteTo.CONSOLE;
  });
  it('should export its config', () => {
    const config = {
      foo: 'bar'
    };

    const runner = new Runner(config);

    expect(runner.getConfig()).toEqual(config);
  });

  it('should run', async () => {
    const config = {
      mockSelenium: true,
      specs: ['*.js'],
      framework: 'debugprint'
    };
    let exitCode;
    const runner = new Runner(config);
    runner.exit_ = function(exit) {
      exitCode = exit;
    };

    await runner.run()
    expect(exitCode).toEqual(0);
  });

  it('should fail with no specs', async () => {
    const config = {
      mockSelenium: true,
      specs: [],
      framework: 'debugprint'
    };

    const runner = new Runner(config);
    let errMessage = 'No error found';
    try {
      await runner.run()
    } catch (err) {
      errMessage = err.message;
    }
    expect(errMessage).not.toBe('No error found');
  });

  it('should fail when no custom framework is defined', async () => {
    const config = {
      mockSelenium: true,
      specs: ['*.js'],
      framework: 'custom'
    };

    const runner = new Runner(config);
    let errMessage = 'No error found';
    try {
      await runner.run()
    } catch (err) {
      errMessage = err.message;
    }
    expect(errMessage).not.toBe('No error found');
  });
});
