#!/usr/bin/env node

'use strict';

var spawn = require('child_process').spawnSync;
var exitCodes = require('../built/exitCodes');

var runProtractor, output, messages;
var checkLogs = function(output, messages) {
  for (var pos in messages) {
    var message = messages[pos];
    if (output.indexOf(message) === -1) {
      throw new Error('\'' + message + '\'' + ' does not exist in logs: ' + output);
    }
  }
};

/******************************
 *Below are exit failure tests*
 ******************************/

// assert authentication error for sauce labs
runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/sauceLabsAuthentication.js']);
output = runProtractor.stdout.toString();
messages = ['Sauce Labs Authentication Error.',
    'Process exited with error code ' + exitCodes.BrowserError.CODE];
checkLogs(output, messages);

// assert authentication error for browser stack
runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/browserStackAuthentication.js']);
output = runProtractor.stdout.toString();
messages = ['Invalid username or password',
    'Process exited with error code ' + exitCodes.BrowserError.CODE];
checkLogs(output, messages);


// assert there is no capabilities in the config
runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/debugMultiCapabilities.js']);
output = runProtractor.stdout.toString();
messages = [
  'Cannot run in debug mode with multiCapabilities, count > 1, or sharding',
  'Process exited with error code ' + exitCodes.ConfigError.CODE];
checkLogs(output, messages);

runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/getMultiCapabilitiesConf.js']);
output = runProtractor.stderr.toString();
messages = [
  'Error: get multi capabilities failed'];
checkLogs(output, messages);
