var TaskScheduler = require('../../built/taskScheduler').TaskScheduler;
var ConfigParser = require('../../built/configParser').ConfigParser;

describe('the task scheduler', function() {

  it('should schedule single capability tests', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        browserName: 'chrome'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task = scheduler.nextTask();
    expect(task.capabilities.browserName).toEqual('chrome');
    expect(task.specs.length).toEqual(2);

    task.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should schedule single capability tests with sharding', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        shardTestFiles: true,
        maxInstances: 2,
        browserName: 'chrome'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task1 = scheduler.nextTask();
    expect(task1.capabilities.browserName).toEqual('chrome');
    expect(task1.specs.length).toEqual(1);

    var task2 = scheduler.nextTask();
    expect(task2.capabilities.browserName).toEqual('chrome');
    expect(task2.specs.length).toEqual(1);

    task1.done();
    task2.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should schedule single capability tests with count', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        count: 2,
        browserName: 'chrome'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task1 = scheduler.nextTask();
    expect(task1.capabilities.browserName).toEqual('chrome');
    expect(task1.specs.length).toEqual(2);

    var task2 = scheduler.nextTask();
    expect(task2.capabilities.browserName).toEqual('chrome');
    expect(task2.specs.length).toEqual(2);

    task1.done();
    task2.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should schedule multiCapabilities tests', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        'browserName': 'chrome'
      }, {
        'browserName': 'firefox'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task1 = scheduler.nextTask();
    expect(task1.capabilities.browserName).toEqual('chrome');
    expect(task1.specs.length).toEqual(2);

    var task2 = scheduler.nextTask();
    expect(task2.capabilities.browserName).toEqual('firefox');
    expect(task2.specs.length).toEqual(2);

    task1.done();
    task2.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should obey maxInstances', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        shardTestFiles: true,
        maxInstances: 1,
        browserName: 'chrome'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task1 = scheduler.nextTask();
    expect(task1.capabilities.browserName).toEqual('chrome');
    expect(task1.specs.length).toEqual(1);

    var task2 = scheduler.nextTask();
    expect(task2).toBeNull();

    task1.done();
    expect(scheduler.numTasksOutstanding()).toEqual(1);

    var task3 = scheduler.nextTask();
    expect(task3.capabilities.browserName).toEqual('chrome');
    expect(task3.specs.length).toEqual(1);

    task3.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should allow capability-specific specs', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        'browserName': 'chrome',
        specs: 'spec/unit/data/fakespecC.js'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task = scheduler.nextTask();
    expect(task.capabilities.browserName).toEqual('chrome');
    expect(task.specs.length).toEqual(3);

    task.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });


  it('should work with only capability-specific specs', function() {
    var toAdd = {
      specs: [
      ],
      multiCapabilities: [{
        'browserName': 'chrome',
        specs: 'spec/unit/data/fakespecC.js'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task = scheduler.nextTask();
    expect(task.capabilities.browserName).toEqual('chrome');
    expect(task.specs.length).toEqual(1);

    task.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should handle multiCapabilities with mixture of features', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        'browserName': 'chrome',
        maxInstances: 2,
        count: 2
      }, {
        'browserName': 'firefox',
        shardTestFiles: true,
        maxInstances: 1,
        count: 2
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task1 = scheduler.nextTask();
    expect(task1.capabilities.browserName).toEqual('chrome');
    expect(task1.specs.length).toEqual(2);
    task1.done();

    var task2 = scheduler.nextTask();
    expect(task2.capabilities.browserName).toEqual('chrome');
    expect(task2.specs.length).toEqual(2);
    task2.done();

    var task3 = scheduler.nextTask();
    expect(task3.capabilities.browserName).toEqual('firefox');
    expect(task3.specs.length).toEqual(1);
    task3.done();

    var task4 = scheduler.nextTask();
    expect(task4.capabilities.browserName).toEqual('firefox');
    expect(task4.specs.length).toEqual(1);
    task4.done();

    var task5 = scheduler.nextTask();
    expect(task5.capabilities.browserName).toEqual('firefox');
    expect(task5.specs.length).toEqual(1);
    task5.done();

    var task6 = scheduler.nextTask();
    expect(task6.capabilities.browserName).toEqual('firefox');
    expect(task6.specs.length).toEqual(1);
    task6.done();

    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

  it('should exclude capability-specific specs', function() {
    var toAdd = {
      specs: [
        'spec/unit/data/fakespecA.js',
        'spec/unit/data/fakespecB.js'
      ],
      multiCapabilities: [{
        'browserName': 'chrome',
        exclude: 'spec/unit/data/fakespecB.js'
      }]
    };
    var config = new ConfigParser().addConfig(toAdd).getConfig();
    var scheduler = new TaskScheduler(config);

    var task = scheduler.nextTask();
    expect(task.capabilities.browserName).toEqual('chrome');
    expect(task.specs.length).toEqual(1);

    task.done();
    expect(scheduler.numTasksOutstanding()).toEqual(0);
  });

});
