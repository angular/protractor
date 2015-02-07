/**
 * Transfer contents of @see tags to the description
 */
module.exports = function transferSee() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      docs.forEach(function(doc) {
        if (doc.see) {
          doc.see.forEach(function(see) {
            var breakIndex = see.indexOf('\n\n');
            if (breakIndex == -1) {
              breakIndex = see.length;
            }
            see = 'See {@link ' + see.substr(0, breakIndex) + '}' +
                see.substr(breakIndex);
            see = see.replace(/\n\n/g, '<br />').replace(/\n/g, ' ');
            if (doc.description.length != 0) {
              doc.description += '<br />';
            }
            doc.description += see;
          });
        }
      });
    }
  };
};
