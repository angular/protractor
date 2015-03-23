(function() {
  /**
   * Controller for webpages derived from markdown files
   *
   * @constructor
   * @ngInject
   * @param $location Location service.
   * @param $scope Angular scope.
   */
  var MarkdownCtrl = function($location, $scope) {
    $scope.path = $location.path();
  };

  angular.module('protractorApp').controller('MarkdownCtrl', MarkdownCtrl);
})();
