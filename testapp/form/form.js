function FormCtrl($scope) {
  $scope.greeting = "Hiya";
  $scope.username = "Anon";
  $scope.aboutbox = "This is a text box";
  $scope.color = "blue";
  $scope.show = true;

  $scope.colors = ['red', 'green', 'blue'];
  $scope.dayColors = [{day: 'Mon', color: 'red'}, {day: 'Tue', color: 'green'}, {day: 'Wed', color: 'blue'}];

  $scope.fruit = '';
  $scope.defaultFruit = 'apple'
  $scope.fruits = ['pear', 'peach', 'banana'];
}
FormCtrl.$inject = ['$scope'];
