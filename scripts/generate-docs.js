#!/usr/bin/env node

/*
 * Usage:
 *
 * ./scripts/generate-docs.js [--use_hash auto|someValue]
 */

'use strict';
var docGenerator = require('dgeni');
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var argv = require('optimist').argv;
var q = require('q');

var apiFileName = 'api.md',
    configPath = path.resolve(__dirname, '../docgen/dgeni-config.js'),
    buildPath = path.resolve(__dirname, '../docgen/build'),
    docsPath = path.resolve(__dirname, '../docs'),
    apiFilePath = path.resolve(docsPath, apiFileName);

/**
 * Delete the docgen/build directory.
 */
function deleteBuildDir() {
  console.log('Deleting build directory', buildPath);

  var deferred = q.defer();

  rimraf(buildPath, function(err) {
    if (err) {
      console.log('Error deleting build path', err);
      return deferred.reject(err);
    }
    console.log('Done deleting build directory');
    deferred.resolve();
  });

  return deferred.promise;
}

/**
 * Generate the docs/api.md document.
 */
function generateDocs(config) {
  console.log('Generating docs');
  docGenerator(config).generateDocs().then(function() {
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
  var contents = buffer.join('\n');

  fs.writeFile(apiFilePath, contents, function(err) {
    if (err) {
      throw err;
    }
    console.log('Done writing file', apiFilePath);
  });
}

/**
 * Get the hash used to link to the source code.
 * @return {Q.promise.<string>} A promise that resolves to the git hash used to
 *     link to the source code.
 */
function readGitHash() {
  var deferred = q.defer();

  var useHash = argv.use_hash;
  // No hash, use master.
  if (!useHash) {
    deferred.resolve('master');
  } else if (useHash.toLowerCase() === 'auto') {
    // Auto? query git to use the latest commit hash.
    var exec = require('child_process').exec;
    exec('git log -n 1 --pretty=format:"%H"', function(error, stdout, stderr) {
      if (error) {
        console.log('Error reading hash from git', error);
        deferred.reject(error);
        return;
      }
      deferred.resolve(stdout);
    });
  } else {
    // Use the hash provided.
    deferred.resolve(useHash);
  }

  return deferred.promise;
}

/*
 * Delete the 'docs/build' directory.
 * Get the hash for the source code links.
 * Create the configuration obj.
 * Generate the api.md file.
 */
deleteBuildDir().
    then(function() {
      return readGitHash();
    }).
    then(function(linksHash) {
      console.log('Using hash for doc links', linksHash);
      return _.extend(require('dgeni/lib/utils/config').load(configPath), {
        linksHash: linksHash
      });
    }).then(function(config) {
      generateDocs(config);
    }).catch(function(err) {
      console.log('Error generating docs', err);
    });
