/**
 * Remove new lines from the tags.
 * @param {!Object} doc Document with the tag.
 */
var removeNewLines = function(doc) {
  if (doc.tags) {
    doc.tags.tags.forEach(function (tag) {
      tag.description = (tag.description || '').replace('\n', ' ');
    })
  }
};

module.exports = {
  name: 'do-stuff',
  description: 'Doing some stuff',
  runAfter: ['extracting-tags'],
  init: function (config) {
  },
  process: function (docs) {
    var i = 1;
    docs.forEach(function(doc) {
      removeNewLines(doc);

      // Get everything until the first @.
      doc.desc = /[^@]*/.exec(doc.content || '')[0];
      doc.outputPath = 'partials/' + doc.fileName + (i++) + '.md'
    });
  }
}
