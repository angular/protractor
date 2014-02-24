var docGenerator = require('dgeni');
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('canonical-path');
var _ = require('lodash');

(function() {
  var configPath = path.resolve(__dirname, '../docs/doc-config.js');
  var buildPath = path.resolve(__dirname, '../docs/build');
  var docsPath = path.resolve(__dirname, '../docs');

  deleteBuild(function() {
    generateDocs();
  });

  function deleteBuild(doneCallback) {
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
        mergeFiles(files);
      });
    });
  }

  function mergeFiles(files) {
    console.log('Merging ' + files.length + ' files into api.md');

    var buffer = [];

    files.forEach(function(file) {
      var contents = fs.readFileSync(path.resolve(buildPath, file), 'utf-8');
      buffer.push(contents);
    });

    if (buffer.length === 0) {
      return;
    }

    var joinedPath = path.resolve(docsPath, 'api.md');
    console.log('joinedPath', joinedPath);

    var joinedContents = buffer.join('\n');
    console.log('joinedContents', joinedContents);

    fs.writeFile(joinedPath, joinedContents, function(err) {
      if (err) {
        throw err;
      }
      console.log('Done done done');
    });
  }
})();
