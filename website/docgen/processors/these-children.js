/**
 * Set the parents of member functions set in the constructor of an object.
 */
module.exports = function theseChildren() {
  return {
    $runAfter: ['extracting-tags'],
    $runBefore: ['tags-extracted'],
    $process: function(docs) {
      var parentDoc = docs[0];
      for (var i = 0; i < docs.length; i++) {
        doc = docs[i];
        if (doc.codeNode && doc.codeNode.expression &&
            doc.codeNode.expression.left  &&
            doc.codeNode.expression.left.object  &&
            doc.codeNode.expression.left.object.type  == 'ThisExpression') {
          doc.name = parentDoc.name + '.prototype.' + doc.name;
        } else {
          parentDoc = doc;
        }
      }
    }
  };
};
