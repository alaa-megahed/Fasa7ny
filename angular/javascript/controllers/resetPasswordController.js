angular.module('fasa7ny')
.controller('resetPasswordController', function($scope, $routeParams, resetPassword) {

    var id = $routeParams.id;
    $scope.form = {};
    $scope.submitForm = function(id){
      resetPassword.reset(id).then(function(data)
      {

      });

    }



});
