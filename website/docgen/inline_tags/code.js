module.exports = function codeTagDef() {
  return {
    name: 'code',
    handler: function(doc, tag, content) {
      return '<code ng-non-bindable>' + content + '</code>';
    },
    description: 'Handle inline code tags',
    aliases: ['monospace']
  };
};
