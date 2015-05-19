function InteractionCtrl($scope, $interval, $http) {

  $scope.messages = [];
  $scope.message = '';
  $scope.user = '';
  $scope.userInput = '';

  $scope.sendUser = function() {
    $scope.user = $scope.userInput;
  };

  var loadMessages = function() {
    $http.get('/chat?q=chatMessages').
      success(function(data) {
        $scope.messages = data ? data : [];
      }).
      error(function(err) {
        $scope.messages = ['server request failed with: ' + err];
      });
  };

  $scope.sendMessage = function() {
    var msg = $scope.user + ': ' + $scope.message;
    $scope.messages.push(msg);
    $scope.message = '';
    
    var data = {
      key: 'newChatMessage',
      value: msg
    };
    $http.post('/chat', data);
  };

  $scope.clearMessages = function() {
    $scope.messages = [];
    
    var data = {
      key: 'clearChatMessages'
    };
    $http.post('/chat', data);
  };

  $interval(function() {
    loadMessages();
  }, 100);
}
InteractionCtrl.$inject = ['$scope', '$interval', '$http'];
