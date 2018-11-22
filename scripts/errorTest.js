#!/usr/bin/env node

'use strict';

const spawn = require('child_process').spawnSync;
const exitCodes = require('../built/exitCodes');

let runProtractor, output, messages;
const checkLogs = (output, messages) => {
  for (let message of messages) {
    if (output.indexOf(message) === -1) {
      throw new Error(`'${message}' does not exist in logs: ${output}`);
    }
  }
};

/******************************
 *Below are exit failure tests*
 ******************************/

// assert authentication error for sauce labs
runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/sauceLabsAuthentication.conf.js']);
output = runProtractor.stdout.toString();
messages = [
    'WebDriverError: Misconfigured -- Sauce Labs Authentication Error.',
    'Process exited with error code ' + exitCodes.BrowserError.CODE];
checkLogs(output, messages);

// assert authentication error for browser stack
runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/browserStackAuthentication.conf.js']);
output = runProtractor.stdout.toString();
messages = ['WebDriverError: Invalid username or password',
    'Process exited with error code ' + exitCodes.BrowserError.CODE];
checkLogs(output, messages);

// assert there is no capabilities in the config
runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/debugMultiCapabilities.conf.js']);
output = runProtractor.stdout.toString();
messages = [
  'Cannot run in debug mode with multiCapabilities, count > 1, or sharding',
  'Process exited with error code ' + exitCodes.ConfigError.CODE];
checkLogs(output, messages);

runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/getMultiCapabilities.conf.js']);
output = runProtractor.stderr.toString();
messages = [
  'Error: get multi capabilities failed'];
checkLogs(output, messages);
