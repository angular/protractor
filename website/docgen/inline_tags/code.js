var htmlSpecialCharMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  "/": '&#x2F;'
};

module.exports = function codeTagDef() {
  return {
    name: 'code',
    handler: function(doc, tag, content) {
      return '<code ng-non-bindable>' +
          content.replace(/[&<>\/]/g, function (s) {
            return htmlSpecialCharMap[s];
          }) + '</code>';
    },
    description: 'Handle inline code tags',
    aliases: ['monospace']
  };
};
