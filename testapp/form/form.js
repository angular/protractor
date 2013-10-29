function FormCtrl($scope) {
  $scope.greeting = "Hiya";
  $scope.username = "Anon";
  $scope.aboutbox = "This is a text box";
  $scope.color = "blue";
  $scope.show = true;
  $scope.days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  $scope.colors = ['red', 'green', 'blue'];
  $scope.dayColors = [{day: 'Mon', color: 'red'}, {day: 'Tue', color: 'green'}, {day: 'Wed', color: 'blue'}];
}
FormCtrl.$inject = ['$scope'];
