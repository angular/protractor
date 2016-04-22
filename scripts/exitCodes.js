#!/usr/bin/env node

'use strict';

var spawn = require('child_process').spawnSync;
var runProtractor, output, messages;
var checkLogs = function(output, messages) {
  for (var pos in messages) {
    var message = messages[pos];
    if (output.indexOf(message) === -1) {
      throw new Error('does not exist in logs: ' + message);
    }
  }
};

/******************************
 *Below are exit failure tests*
 ******************************/

// // assert authentication error for sauce labs
// runProtractor = spawn('node',
//     ['bin/protractor', 'spec/errorTest/sauceLabsAuthentication.js']);
// output = runProtractor.stdout.toString();
// messages = ['WebDriverError: Sauce Labs Authentication Error.',
//     'Process exited with error code 135'];
// checkLogs(output, messages);


runProtractor = spawn('node',
    ['bin/protractor', 'spec/errorTest/browserStackAuthentication.js']);
output = runProtractor.stdout.toString();
messages = ['WebDriverError: Invalid username or password',
    'Process exited with error code 135'];
checkLogs(output, messages);
