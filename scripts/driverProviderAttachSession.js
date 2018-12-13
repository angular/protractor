#!/usr/bin/env node

'use strict';

const http = require('http');
const child_process = require('child_process');

// Delete session method to be used at the end of the test as well as
// when the tests fail.
const deleteSession = (sessionId, err) => {
  return new Promise(resolve => {
    const deleteOptions = {
      hostname: 'localhost',
      port: 4444,
      path: '/wd/hub/session/' + sessionId,
      method: 'DELETE'
    };
    const req = http.request(deleteOptions, res => {
      res.on('end', () => {
        if (err) {
          throw err;
        }
        resolve();
      });
    });
    req.end();
  });
};

const run = async () => {
  // 1. Create a new selenium session.
  const sessionId = await new Promise(resolve => {
    const postData = JSON.stringify(
      {'desiredCapabilities': {'browserName': 'chrome'}});
    const createOptions = {
      hostname: '127.0.0.1',
      port: 4444,
      path: '/wd/hub/session',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    let body = '';
    const req = http.request(createOptions, (res) => {
      res.on('data', (data) => {
        body = JSON.parse(data.toString());
      });
      res.on('end', () => {
        resolve(body.sessionId);
      });
    });
    req.write(postData);
    req.end();
  });

  await new Promise(resolve => {
    // 2. After getting the session id, verify that the selenium session exists.
    // If the session exists, run the protractor test.
    const checkOptions = {
      hostname: '127.0.0.1',
      port: 4444,
      path: '/wd/hub/sessions',
      method: 'GET'
    };
    
    let values = [];
    const req = http.request(checkOptions, (res) => {
      res.on('data', (chunk) => {
        values = JSON.parse(chunk.toString())['value'];
      });
      res.on('end', () => {
        let found = false;
        for (let value of values) {
          if (value['id'] === sessionId) {
            found = true;
          }
        }
        if (found) {
          resolve();
        } else {
          throw new Error('The selenium session was not created.');
        }
      });
      res.on('error', (err) => {
        console.log(err);
        process.exit(1);
      });
    });
    req.end();
  });

  // 3. Run Protractor and attach to the session.
  const runProtractor = child_process.spawnSync('node',
      ['bin/protractor', 'spec/driverProviderAttachSessionConf.js',
      '--seleniumSessionId=' + sessionId]);
  console.log(runProtractor.stdout.toString());
  if (runProtractor.status !== 0) {
    const e = new Error('Protractor did not run properly.');
    await deleteSession(sessionId, e);
    process.exit(1);
  }

  // 4. After the protractor test completes, check to see that the session still
  // exists. If we can find the session, delete it.
  await new Promise(resolve => {
    const checkOptions = {
      hostname: '127.0.0.1',
      port: 4444,
      path: '/wd/hub/session/' + sessionId,
      method: 'GET'
    };
    const req = http.request(checkOptions, (res) => {
      let state = '';
      res.on('data', (chunk) => {    
        state = JSON.parse(chunk.toString()).state;
      });
      res.on('end', () => {
        if (state === 'success') {
          resolve();
        }
        else {
          const e = new Error('The selenium session should still exist.');
          deleteSession(sessionId, e);
        }
      });
      res.on('error', (err) => {
        console.log(err);
        process.exit(1);
      });
    });
    req.end();
  });

  // 5. Delete the selenium session.
  await deleteSession(sessionId); 
}

run().then();
