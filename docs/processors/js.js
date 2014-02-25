var NEW_LINE = /\n\r?/;
var DOC_COMMENT_START = /^\s*\/\*\*\s*(.*)$/;
var LEADING_STAR = /^\s*\*\s?/;
var END_COMMENT = /\*\//;
var BLANK_LINE = /^\s*\n\r?/;


/**
 * This is almost the same code as the original js extractor of dgeni. This
 * version reads the line after the closing comment.
 *
 * @description
 * This extractor will pull all docs out from comments in the JS code
 * Each doc will initially have the form:
 * {
 *   fileType: 'js',
 *   startingLine: 123,
 *   file: 'path/to/file.js'
 *   content: 'the content of the ngdoc block, stripped of comment stars',
 *   fnDef: {
 *     line: 'the next line after the closing comment',
 *     lineNumber: 234
 *   }
 * }
 */

module.exports = {
  pattern: /\.js$/,
  processFile: function(filePath, contents, basePath) {

    // Bail out if there is no contents
    if (!contents) {
      return [];
    }

    var docs = [], currentDoc, match,
        lines = contents.split(NEW_LINE);

    lines.forEach(function(line, lineNumber) {

      // is the comment starting?
      if (!currentDoc && (match = line.match(DOC_COMMENT_START))) {

        // Strip off comment start
        line = match[1];

        // Create a new doc, merging in any default properties
        currentDoc = {
          fileType: 'js',
          startingLine: lineNumber + 1, // We want lines to be 1-based
          file: filePath,
          basePath: basePath,
          content: ''
        };
      }


      // are we done?
      if (currentDoc && line.match(END_COMMENT)) {

        // strip out any blank lines
        currentDoc.content = currentDoc.content.replace(BLANK_LINE, '');

        // Get the next line, which will probably contain the function.
        if (lineNumber + 1 < lines.length) {
          currentDoc.fnDef = {
            line: lines[lineNumber + 1],
            lineNumber: lineNumber + 1
          }
        }

        docs.push(currentDoc);

        currentDoc = undefined;
      }

      // we are in a doc comment so add text (removing leading stars)
      if (currentDoc) {
        currentDoc.content += '\n' + line.replace(LEADING_STAR, '');
      }
    });

    return docs;
  }
};
