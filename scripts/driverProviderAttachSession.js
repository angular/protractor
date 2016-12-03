#!/usr/bin/env node

'use strict';

var http = require('http'),
    spawn = require('child_process').spawnSync;

var sessionId = '';

// 1. Create a new selenium session.
var postData = JSON.stringify(
  {'desiredCapabilities': {'browserName': 'firefox'}});
var createOptions = {
  hostname: 'localhost',
  port: 4444,
  path: '/wd/hub/session',
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
};
var req = http.request(createOptions, function(res) {
  res.on('data', setBody);
  res.on('end', checkSession);
});
req.write(postData);
req.end();

// 2. After making the request to create a selenium session, read the selenium
// session id.
var setBody = function(chunk) {
  var body = chunk.toString();
  sessionId = JSON.parse(body).sessionId;
};

// 3. After getting the session id, verify that the selenium session exists.
// If the session exists, run the protractor test.
var checkSession = function() {
  var checkOptions = {
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub/session/' + sessionId,
    method: 'GET'
  };
  var state = '';
  var req = http.request(checkOptions, function(res) {
    res.on('data', function(chunk) {
      state = JSON.parse(chunk.toString()).state;
    });
    res.on('end', function() {
      if (state === 'success') {
        var runProtractor = spawn('node',
            ['bin/protractor', 'spec/driverProviderAttachSessionConf.js',
            '--seleniumSessionId=' + sessionId]);
        console.log(runProtractor.stdout.toString());
        if (runProtractor.status !== 0) {
          throw new Error('Protractor did not run properly.');
        }
      }
      else {
        throw new Error('The selenium session was not created.');
      }
      checkStoppedSession();
    });
  });
  req.end();
};

// 4. After the protractor test completes, check to see that the session still
// exists. If we can find the session, delete it.
var checkStoppedSession = function() {
  var checkOptions = {
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub/session/' + sessionId,
    method: 'GET'
  };
  var state = '';
  var req = http.request(checkOptions, function(res) {
    res.on('data', function(chunk) {
      state = JSON.parse(chunk.toString()).state;
    });
    res.on('end', function() {
      if (state === 'success') {
        deleteSession();
      }
      else {
        throw new Error('The selenium session should still exist.');
      }
    });
  });
  req.end();
};

// 5. Delete the selenium session.
var deleteSession = function() {
  var deleteOptions = {
    hostname: 'localhost',
    port: 4444,
    path: '/wd/hub/session/' + sessionId,
    method: 'DELETE'
  };
  var req = http.request(deleteOptions);
  req.end();
};
