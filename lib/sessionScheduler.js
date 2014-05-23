/**
 * The sessionScheduler keeps track of the specs that needs to run next
 * and which session is running what
 */
'use strict';

var ConfigParser = require('./configParser');

// A queue of specs for a particular capacity
var SessionQueue = function(capability, specsList) {
  this.capability = capability;
  this.curInst = 0;
  this.maxInst = (capability.maxInstances ? capability.maxInstances : 1);
  this.specsIndex = 0;
  this.specsList = specsList;
};

// A scheduler to keep track of specs that need running and their associated 
// capability. It will suggest a session (combination of capability and spec) 
// to run while observing the following config rules: capabilities,  
// multiCapabilities, splitTestsBetweenCapabilities, and maxInstance
var SessionScheduler = function(config) {
  var excludes = ConfigParser.resolveFilePatterns(config.exclude, true, config.configDir);
  var allSpecs = ConfigParser.resolveFilePatterns(
    ConfigParser.getSpecs(config), false, config.configDir).filter(function(path) {
    return excludes.indexOf(path) < 0;
  });

  if (config.multiCapabilities.length) {
    console.log('Running using config.multiCapabilities - ' +
         'config.capabilities will be ignored');
  } else {
    // Use capabilities if multiCapabilities is empty.
    config.multiCapabilities = [config.capabilities];
  }

  var sessionQueues = [];
  config.multiCapabilities.forEach(function(capability) {
    var specsList = allSpecs;
    if (capability.specs) {
      var capabilitySpecs = ConfigParser.resolveFilePatterns(
        capability.specs, false, config.configDir);
      specsList = specsList.concat(capabilitySpecs);
    }
    // If we don't split between capabilities, we return an one element array.
    specsList = config.splitTestsBetweenCapabilities ? specsList : [specsList];

    sessionQueues.push(new SessionQueue(capability, specsList));
  });
  this.sessionQueues = sessionQueues;
  this.config = config;
  this.rotationIndex = 0; // Helps suggestions to rotate amongst capabilities
};

// Returns the next session that is allowed to run without going over maxInstance
// Returns capability, specs, sessionId and a callback 'done' to signal task is done
SessionScheduler.prototype.nextSession = function() {
  for (var i = 0; i < this.sessionQueues.length; ++i) {
    var rotatedIndex = ((i + (this.rotationIndex++)) % this.sessionQueues.length);
    var q = this.sessionQueues[rotatedIndex];
    if (q.curInst < q.maxInst && q.specsIndex < q.specsList.length) {
      ++q.curInst;
      var specs = q.specsList[q.specsIndex];
      if (!(specs instanceof Array)) {
        specs = [specs];
      }
      ++q.specsIndex;

      return {
        capability: q.capability,
        specs: specs,
        sessionId: q.specsIndex,
        done: function() {
          --q.curInst;
        }
      };
    }
  }

  return null;
};

// Returns number of sessions left to run
SessionScheduler.prototype.numSessionsRemaining = function() {
  var count = 0; 
  this.sessionQueues.forEach(function(q) {
    count += (q.specsList.length - q.specsIndex);
  });
  return count; 
};

// Returns maximum number of concurrent sessions required/permitted
SessionScheduler.prototype.maxSessions = function() {
  if (this.config.maxSessions && this.config.maxSessions > 0) {
    return this.config.maxSessions;
  } else {
    var count = 0; 
    this.sessionQueues.forEach(function(q) {
      count += Math.min(q.maxInst, q.specsList.length);
    });
    return count; 
  }
};

// Returns number of sessions currently running
SessionScheduler.prototype.countActiveSessions = function() {
  var count = 0;
  this.sessionQueues.forEach(function(q) {
    count += q.curInst;
  });
  return count;
};

module.exports = SessionScheduler;
