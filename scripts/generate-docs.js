var docGenerator = require('dgeni');
var rimraf = require('rimraf');
var path = require('canonical-path');

(function() {
  var configPath = path.resolve(__dirname, '../docs/doc-config.js');

  var buildPath = path.resolve(__dirname, '../docs/build');

  console.log('Deleting build directory', buildPath);
  rimraf(buildPath, function(err) {
    if (err) {
      throw  err;
    }
    console.log('Done deleting build directory');
    generateDocs();
  });

  function generateDocs() {
    console.log('Generating docs');
    docGenerator(configPath).generateDocs().then(function(docs) {
      console.log("I am done");
    });
  }
})();
