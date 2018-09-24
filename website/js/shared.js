/*
 * Use the $sce service to trust the html rendered in the view.
 * Also parse links
 *
 * @param $sce The $sce service from Angular
 * @param {String} html The HTML to trust
 * @return {*} An object that can be passed to $sce.getTrustedHtml(value) to
 *   obtain the original value
 */
function trustHTML($sce, html) {
  if (!html) {
    return;
  }

  // Does it come with a type? Types come escaped as [description](theType).
  var match;
  while (match = html.match(/(\[(.*?)\]\((.*?)\))/)) {
    var link = '<a href="' +
        (match[3].match(/^https?:\/\//) ? '' : '#/api?view=') + match[3] +
        '">' + match[2] + '</a>';
    html = html.replace(match[1], link);
  }

  return $sce.trustAsHtml(html);
}
