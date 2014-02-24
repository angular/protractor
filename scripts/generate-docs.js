var docGenerator = require('dgeni');
var rimraf = require('rimraf');
var fs = require('fs');
var path = require('canonical-path');
var _ = require('lodash');

//(function() {
  var apiFileName = 'api.md',
      configPath = path.resolve(__dirname, '../docs/doc-config.js'),
      buildPath = path.resolve(__dirname, '../docs/build'),
      docsPath = path.resolve(__dirname, '../docs');

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

        var sortedFiles = [];

        // Group by file name.
        var grouped = _.groupBy(files, function(fileName) {
          return fileName.replace(/\d*\.md/, '');
        });

        var fileOrder = ['toc', 'protractor', 'locators', 'webdriver'];
        fileOrder.forEach(function(fileName) {
          console.log(fileName);
          sortedFiles = sortedFiles.concat(grouped[fileName]);
        });

        mergeFiles(sortedFiles);
      });
    });
  }

  function mergeFiles(files) {
    console.log('Merging ' + files.length + ' files into ' + apiFileName);

    var buffer = [];

    // Read all the files.
    files.forEach(function(file) {
      var contents = fs.readFileSync(path.resolve(buildPath, file), 'utf-8');
      buffer.push(contents);
    });

    if (buffer.length === 0) {
      return;
    }

    // Write file.
    var joinedPath = path.resolve(docsPath, 'api.md'),
        contents = buffer.join('\n');

    fs.writeFile(joinedPath, contents, function(err) {
      if (err) {
        throw err;
      }
      console.log('Done writing file');
    });
  }
//})();
