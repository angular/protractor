#!/usr/bin/env node
var fs = require('fs');
var url = require('url');
var http = require('http');


// Function to download file using HTTP.get
exports.download_file_httpget = function(file_url, DOWNLOAD_DIR, callback) {
  console.log('downloading ' + file_url + '...');
  var options = {
    host: url.parse(file_url).host,
    port: 80,
    path: url.parse(file_url).pathname
  };

  var file_name = url.parse(file_url).pathname.split('/').pop();
  var file_path = DOWNLOAD_DIR + file_name;
  
  if (fs.existsSync(file_path)){
    console.log(file_name+" already exists in directory");
    return;
  }
  
  var file = fs.createWriteStream(file_path);

  http.get(options, function(res) {
    res.on('data', function(data) {
      file.write(data);
    }).on('end', function() {
      file.end(function() {
        console.log(file_name + ' downloaded to ' + file_path);
        if (callback) {
          callback(file_path);
        }
      });
    });
  });
};

