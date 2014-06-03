/**
 * The taskScheduler keeps track of the specs that needs to run next
 * and which task is running what.
 */
'use strict';

var ConfigParser = require('./configParser');

// A queue of specs for a particular capacity
var TaskQueue = function(capability, specsList) {
  this.capability = capability;
  this.currentInstance = 0;
  this.maxInstance = capability.maxInstances || 1;
  this.specsIndex = 0;
  this.specsList = specsList;
};

/**
 * A scheduler to keep track of specs that need running and their associated 
 * capability. It will suggest a task (combination of capability and spec) 
 * to run while observing the following config rules: capabilities,  
 * multiCapabilities, shardTestFiles, and maxInstance
 *
 * @constructor
 * @param {Object} config parsed from the config file
 * @return {TaskScheduler}
 */
var TaskScheduler = function(config) {
  var excludes = ConfigParser.resolveFilePatterns(config.exclude, true, config.configDir);
  var allSpecs = ConfigParser.resolveFilePatterns(
      ConfigParser.getSpecs(config), false, config.configDir).filter(function(path) {
    return excludes.indexOf(path) < 0;
  });

  if (config.capabilities) {
    if (config.multiCapabilities.length) {
      console.log('Running using config.multiCapabilities - ' +
        'config.capabilities will be ignored');
    } else {
      // Use capabilities if multiCapabilities is empty.
      config.multiCapabilities = [config.capabilities];
    }
  } else if (!config.multiCapabilities.length) {
    // Default to chrome if no capability given
    config.multiCapabilities = [{
      browserName: 'chrome'
    }];
  }

  var taskQueues = [];
  config.multiCapabilities.forEach(function(capability) {
    var specsList = allSpecs;
    if (capability.specs) {
      var capabilitySpecs = ConfigParser.resolveFilePatterns(
          capability.specs, false, config.configDir);
      
      specsList = specsList.concat(capabilitySpecs);
      
      // Make list unique.
      specsList = specsList.filter(function(value, index, self) { 
        return self.indexOf(value) === index;
      });
    }
    // If we don't split between capabilities, we return an one element array.
    specsList = capability.shardTestFiles ? specsList : [specsList];

    capability.count = capability.count || 1;

    for (var i = 0; i < capability.count; ++i) {
      taskQueues.push(new TaskQueue(capability, specsList));
    }
  });
  this.taskQueues = taskQueues;
  this.config = config;
  this.rotationIndex = 0; // Helps suggestions to rotate amongst capabilities
};

/**
 * Get the next task that is allowed to run without going over maxInstance
 *
 * @return {object} capability, specs, taskId and a callback function 'done' 
 *     to signal task is done
 */
TaskScheduler.prototype.nextTask = function() {
  for (var i = 0; i < this.taskQueues.length; ++i) {
    var rotatedIndex = ((i + this.rotationIndex) % this.taskQueues.length);
    var q = this.taskQueues[rotatedIndex];
    if (q.currentInstance < q.maxInstance && q.specsIndex < q.specsList.length) {
      this.rotationIndex = rotatedIndex + 1;
      ++q.currentInstance;
      var taskId = rotatedIndex + 1;
      if (q.specsList.length > 1) {
        taskId += String.fromCharCode(97 + q.specsIndex); //ascii 97 is 'a'
      }
      var specs = q.specsList[q.specsIndex];
      if (!(specs instanceof Array)) {
        specs = [specs];
      }
      ++q.specsIndex;

      return {
        capability: q.capability,
        specs: specs,
        taskId: taskId,
        done: function() {
          --q.currentInstance;
        }
      };
    }
  }

  return null;
};

/**
 * Get the number of tasks left to run
 *
 * @return {number}
 */
TaskScheduler.prototype.numTasksRemaining = function() {
  var count = 0; 
  this.taskQueues.forEach(function(q) {
    count += (q.specsList.length - q.specsIndex);
  });
  return count; 
};

/**
 * Get maximum number of concurrent tasks required/permitted
 *
 * @return {number}
 */
TaskScheduler.prototype.maxConcurrentTasks = function() {
  if (this.config.maxSessions && this.config.maxSessions > 0) {
    return this.config.maxSessions;
  } else {
    var count = 0; 
    this.taskQueues.forEach(function(q) {
      count += Math.min(q.maxInstance, q.specsList.length);
    });
    return count; 
  }
};

/**
 * Returns number of tasks currently running
 *
 * @return {number}
 */
TaskScheduler.prototype.countActiveTasks = function() {
  var count = 0;
  this.taskQueues.forEach(function(q) {
    count += q.currentInstance;
  });
  return count;
};

module.exports = TaskScheduler;
