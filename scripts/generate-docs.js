#!/usr/bin/env node

var docGenerator = require('dgeni');
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('canonical-path');
var _ = require('lodash');

var apiFileName = 'api.md',
    configPath = path.resolve(__dirname, '../docs/doc-config.js'),
    buildPath = path.resolve(__dirname, '../docs/build'),
    docsPath = path.resolve(__dirname, '../docs');

deleteBuildDir(function() {
  generateDocs();
});

function deleteBuildDir(doneCallback) {
  console.log('Deleting build directory', buildPath);
  rimraf(buildPath, function(err) {
    if (err) {
      throw  err;
    }
    console.log('Done deleting build directory');
    doneCallback();
  });
}

function generateDocs() {
  console.log('Generating docs');
  docGenerator(configPath).generateDocs().then(function() {
    fs.readdir(buildPath, function(err, files) {
      if (err) {
        throw  err;
      }

      var sortedFiles = [];

      // Group by file name.
      var grouped = _.groupBy(files, function(fileName) {
        return fileName.replace(/\d*\.md/, '');
      });

      // Sort the files in the following order:
      // toc - table of contents
      // protractor
      // locators
      // webdriver
      var fileOrder = ['toc', 'protractor', 'locators', 'webdriver'];
      fileOrder.forEach(function(fileName) {
        sortedFiles = sortedFiles.concat(grouped[fileName]);
      });

      mergeFiles(sortedFiles);
    });
  });
}

/**
 * Merge all the partial files into the final api.md file.
 * @param {Array.<string>} files Partial files containing the functions.
 */
function mergeFiles(files) {
  console.log('Merging ' + files.length + ' files into ' + apiFileName);

  var buffer = [];

  // Read each file and put them into the buffer.
  files.forEach(function(file) {
    var contents = fs.readFileSync(path.resolve(buildPath, file), 'utf-8');
    buffer.push(contents);
  });

  if (buffer.length === 0) {
    return;
  }

  // Write the buffer into the output file.
  var apiFilePath = path.resolve(docsPath, apiFileName),
      contents = buffer.join('\n');

  fs.writeFile(apiFilePath, contents, function(err) {
    if (err) {
      throw err;
    }
    console.log('Done writing file', apiFilePath);
  });
}
