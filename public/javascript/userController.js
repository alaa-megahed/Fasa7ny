angular.module('userController',[])

.controller('userctrl', function($scope, $http, User) {
  $scope.subscribe = function(id) {
    User.get(id)
    .then(function() {
      console.log("hohohoho");
    })
  }
});
