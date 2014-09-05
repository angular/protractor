#!/usr/bin/env node

var express = require('express');
var optimist = require('optimist');
var util = require('util');
var path = require('path');

var testApp = express();
var DEFAULT_PORT = process.env.HTTP_PORT || 8081;
var testAppDir = path.resolve(__dirname, '..');

var argv = optimist.describe('port', 'port').
    default('port', DEFAULT_PORT).
    describe('ngversion', 'version of AngularJS to use').
    default('ngversion', '1.3.0-rc0').
    argv;

var angularDir = path.join(testAppDir, 'lib/angular_v' + argv.ngversion);

var main = function() {
  var port = argv.port;
  testApp.listen(port);
  util.puts(["Starting express web server in", testAppDir ,"on port", port].
      join(" "));
};

var testMiddleware = function(req, res, next) {
  if (req.path == '/fastcall') {
    res.send(200, 'done');
  } else if (req.path == '/slowcall') {
    setTimeout(function() {
      res.send(200, 'finally done');
    }, 5000);
  } else if (req.path == '/fastTemplateUrl') {
    res.send(200, 'fast template contents');
  } else if (req.path == '/slowTemplateUrl') {
    setTimeout(function() {
      res.send(200, 'slow template contents');
    }, 5000);
  } else {
    return next();
  }
};

testApp.configure(function() {
  testApp.use('/lib/angular', express.static(angularDir));
  testApp.use(express.static(testAppDir));
  testApp.use(testMiddleware);
});

main();
