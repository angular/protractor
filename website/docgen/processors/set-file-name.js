module.exports = {
  name: 'set-file-name',
  description: 'Set the file name of the output file',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function(config) {
  },
  process: function(docs) {
    // Generate the output file name.
    docs.forEach(function(doc) {
      doc.outputPath = doc.name + '.html';
    });

    return  docs;
  }
};
