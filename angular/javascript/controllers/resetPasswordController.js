angular.module('fasa7ny')
.controller('resetPasswordController', function($scope, $routeParams, resetPassword, $window, $timeout) {

    var token = $routeParams.token;
    $scope.form = {};
    $scope.submitForm = function(){
      resetPassword.reset(token, $scope.form).then(function(data)
      {
        if(data.data.startsWith("Success!" ))
        {
            $scope.success = data.data;
            $timeout(function() {
            $window.location = $window.location.protocol + "//" + "localhost:8000" + $window.location.pathname + "/";
          }, 2000);
        }

        else {
          $scope.err = data.data;
        }
      });

    }



});
