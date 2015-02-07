/**
 * Set the input file name.
 */
module.exports = function setFileName() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        doc.fileName = doc.fileInfo.baseName;
      });

      return docs;
    }
  };
};
