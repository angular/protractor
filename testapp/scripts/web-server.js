#!/usr/bin/env node

var express = require('express');
var util = require('util');
var testApp = express();
var DEFAULT_PORT = process.env.HTTP_PORT || 8081;
var testAppDir = require('path').resolve(__dirname, '..');

var main = function(argv) {
  var port = Number(argv[2]) || DEFAULT_PORT;
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
  testApp.use(express.static(testAppDir));
  testApp.use(testMiddleware);
});

main(process.argv);
