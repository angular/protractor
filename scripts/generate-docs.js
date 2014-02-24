var docGenerator = require('dgeni');
var path = require('canonical-path');

(function() {
  var configPath = path.resolve(__dirname, '../docs/doc-config.js');

  docGenerator(configPath).generateDocs().then(function(docs) {
    console.log("I am done");
  });


})();
