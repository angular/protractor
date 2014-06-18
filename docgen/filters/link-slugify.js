// Transform links & anchors like 'elementFinder.isPresent' into
// 'api-elementfinder-ispresent'.
module.exports = {
  name: 'slugify',
  process: function(str) {
    return 'api-' + str.replace(/\./g, '-').toLocaleLowerCase();
  }
};
