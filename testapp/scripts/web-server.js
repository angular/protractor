#!/usr/bin/env node

var express = require('express');
var bodyParser = require('body-parser')
var optimist = require('optimist');
var util = require('util');
var path = require('path');
var env = require('../../spec/environment.js');

var testApp = express();
var DEFAULT_PORT = process.env.HTTP_PORT || env.webServerDefaultPort;
var testAppDir = path.resolve(__dirname, '..');
var defaultAngular = require(path.resolve(testAppDir, 'ng1/lib/angular_version.js'));

var argv = optimist.describe('port', 'port').
    default('port', DEFAULT_PORT).
    describe('ngversion', 'version of AngularJS to use').
    default('ngversion', defaultAngular).
    argv;

var angularDir = path.resolve(testAppDir, 'ng1/lib/angular_v' + argv.ngversion);

var main = function() {
  var port = argv.port;
  testApp.use('/ng1/lib/angular', express.static(angularDir));
  testApp.use(express.static(testAppDir));
  testApp.use(bodyParser.json());
  testApp.use(testMiddleware);
  testApp.listen(port);
  util.puts(["Starting express web server in", testAppDir ,"on port", port].
      join(" "));
};

var storage = {};
var testMiddleware = function(req, res, next) {
  if (/ng[1-2]\/fastcall/.test(req.path)) {
    res.status(200).send('done');
  } else if (/ng[1-2]\/slowcall/.test(req.path)) {
    setTimeout(function() {
      res.status(200).send('finally done');
    }, 5000);
  } else if (/ng[1-2]\/fastTemplateUrl/.test(req.path)) {
    res.status(200).send('fast template contents');
  } else if (/ng[1-2]\/slowTemplateUrl/.test(req.path)) {
    setTimeout(function() {
      res.status(200).send('slow template contents');
    }, 5000);
  } else if (/ng[1-2]\/chat/.test(req.path)) {
    if (req.method === 'GET') {
      var value;
      if (req.query.q) {
        value = storage[req.query.q];
        res.status(200).send(value);
      } else {
        res.status(400).send('must specify query');
      }
    } else if (req.method === 'POST') {
      if (req.body.key == 'newChatMessage') {
        if (!storage['chatMessages']) {
          storage['chatMessages'] = [];
        }
        storage['chatMessages'].push(req.body.value);
        res.sendStatus(200);
      } else if (req.body.key == 'clearChatMessages') {
        storage['chatMessages'] = [];
        res.sendStatus(200);
      } else {
        res.status(400).send('Unknown command');
      }
    } else {
      res.status(400).send('only accepts GET/POST');
    }
  } else {
    return next();
  }
};

main();
