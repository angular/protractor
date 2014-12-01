module.exports = function codeTagDef() {
  return {
    name: 'code',
    handler: function(doc, tag, content) {
      return '<code>' + content + '</code>';
    },
    description: 'Handle inline code tags',
    aliases: ['monospace']
  };
}
