var _ = require('lodash');

/**
 * Remove new lines from the params.
 * @param {!Object} doc Document with the tag.
 */
var fixParams = function (doc) {
  // Remove duplicates.
  doc.params = _.uniq(doc.params, function(param) { return param.name });

  if (doc.name == 'element.all') {
    _.each(doc.params, function (param) {
      console.log(param);
    });
  }


  if (!doc.params) {
    return;
  }

  doc.tags.tags.forEach(function (tag) {
    tag.description = (tag.description || '').replace('\n', ' ');
  });
};

/**
 * Parse the example and the content.
 * @param {!Object} doc Document with the tag.
 */
var parseExampleAndContent = function (doc) {
  var description = doc.description || '',
      index = description.indexOf('Example:');

  if (doc.name == 'element.all') {
    console.log(doc);
  }

  if (index >= 0) {
    doc.example = description.substring(index).replace('Example:\n', '');
    doc.desc = description.substring(0, index);
  }
};

module.exports = {
  name: 'tag-fixer',
  description: 'Do some processing before rendering',
  runAfter: ['extracting-tags'],
  runBefore: ['tags-extracted'],
  init: function (config) {
  },
  process: function (docs) {
    var i = 1;
    docs.forEach(function (doc) {
      fixParams(doc);
      parseExampleAndContent(doc);

      doc.outputPath = 'partials/' + doc.fileName + (i++) + '.md'
    });
  }
};
