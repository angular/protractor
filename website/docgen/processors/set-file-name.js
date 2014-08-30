/**
 * Set the file name of the output file.
 */
module.exports = function setFileName() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      // Generate the output file name.
      docs.forEach(function(doc) {
        doc.outputPath = doc.name + '.html';
      });

      return  docs;
    }
  }
};
