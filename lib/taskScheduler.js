/**
 * The taskScheduler keeps track of the specs that needs to run next
 * and which task is running what.
 */
'use strict';

var ConfigParser = require('./configParser');

// A queue of specs for a particular capacity
var TaskQueue = function(capability, specLists) {
  this.capability = capability;
  this.numRunningInstances = 0;
  this.maxInstance = capability.maxInstances || 1;
  this.specsIndex = 0;
  this.specLists = specLists;
};

/**
 * A scheduler to keep track of specs that need running and their associated 
 * capability. It will suggest a task (combination of capability and spec) 
 * to run while observing the following config rules: capabilities,  
 * multiCapabilities, shardTestFiles, and maxInstance.
 *
 * @constructor
 * @param {Object} config parsed from the config file
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
    var capabilitySpecs = allSpecs;
    if (capability.specs) {
      var capabilitySpecificSpecs = ConfigParser.resolveFilePatterns(
          capability.specs, false, config.configDir);
      capabilitySpecs = capabilitySpecs.concat(capabilitySpecificSpecs);
    }

    var specLists = [];
    // If we shard, we return an array of one element arrays, each containing 
    // the spec file. If we don't shard, we return an one element array 
    // containing an array of all the spec files
    if (capability.shardTestFiles) {
      capabilitySpecs.forEach(function(spec) {
        specLists.push([spec]);
      });
    } else {
      specLists.push(capabilitySpecs);
    }

    capability.count = capability.count || 1;

    for (var i = 0; i < capability.count; ++i) {
      taskQueues.push(new TaskQueue(capability, specLists));
    }
  });
  this.taskQueues = taskQueues;
  this.config = config;
  this.rotationIndex = 0; // Helps suggestions to rotate amongst capabilities
};

/**
 * Get the next task that is allowed to run without going over maxInstance.
 *
 * @return {{capability: Object, specs: Array.<string>, taskId: string, done: function()}}
 */
TaskScheduler.prototype.nextTask = function() {
  for (var i = 0; i < this.taskQueues.length; ++i) {
    var rotatedIndex = ((i + this.rotationIndex) % this.taskQueues.length);
    var queue = this.taskQueues[rotatedIndex];
    if (queue.numRunningInstances < queue.maxInstance && 
        queue.specsIndex < queue.specLists.length) {
      this.rotationIndex = rotatedIndex + 1;
      ++queue.numRunningInstances;
      var taskId = rotatedIndex + 1;
      if (queue.specLists.length > 1) {
        taskId += String.fromCharCode(97 + queue.specsIndex); //ascii 97 is 'a'
      }
      var specs = queue.specLists[queue.specsIndex];
      ++queue.specsIndex;

      return {
        capability: queue.capability,
        specs: specs,
        taskId: taskId,
        done: function() {
          --queue.numRunningInstances;
        }
      };
    }
  }

  return null;
};

/**
 * Get the number of tasks left to run.
 *
 * @return {number}
 */
TaskScheduler.prototype.numTasksRemaining = function() {
  var count = 0; 
  this.taskQueues.forEach(function(queue) {
    count += (queue.specLists.length - queue.specsIndex);
  });
  return count; 
};

/**
 * Get maximum number of concurrent tasks required/permitted.
 *
 * @return {number}
 */
TaskScheduler.prototype.maxConcurrentTasks = function() {
  if (this.config.maxSessions && this.config.maxSessions > 0) {
    return this.config.maxSessions;
  } else {
    var count = 0; 
    this.taskQueues.forEach(function(queue) {
      count += Math.min(queue.maxInstance, queue.specLists.length);
    });
    return count; 
  }
};

/**
 * Returns number of tasks currently running.
 *
 * @return {number}
 */
TaskScheduler.prototype.countActiveTasks = function() {
  var count = 0;
  this.taskQueues.forEach(function(queue) {
    count += queue.numRunningInstances;
  });
  return count;
};

module.exports = TaskScheduler;
