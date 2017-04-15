angular.module('homepageController', [])

  .controller('main' , function($rootScope, $scope, $http, $modal, $log, Homepage, LoggedIn) {

    LoggedIn.check()
           .then(function(data) {
               $scope.user = data;
           });
    Homepage.get()
           .then(function(data) {
           });


    $scope.err = "";

    $scope.signUp = function() {
      var modalInstance = $modal.open({
                templateUrl: 'views/signup-form.html',
                controller: 'ModalInstanceCtrl' ,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

        modalInstance.result.then(function (selectedItem) {
                $scope.err1 = selectedItem.err;
                if($scope.err1 === "The username or email provided is already taken." )
                  $scope.signUp();
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });

    }

    $scope.signIn = function() {

      var modalInstance = $modal.open({
                templateUrl: 'views/signin-form.html',
                controller: 'ModalInstanceCtrl1' ,
                scope: $scope,
                resolve: {
                    userForm: function () {
                        return $scope.userForm;
                    }
                }
            });

        modalInstance.result.then(function (selectedItem) {
                $scope.err = selectedItem.err;
                if($scope.err === "Oops! Wrong password." || $scope.err === "No user found." )
                  $scope.signIn();
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });


    }
  })


  .controller('ModalInstanceCtrl', function ($scope, $http, $window, $modalInstance, userForm, Homepage) {
      $scope.form = {};
      $scope.submitForm = function (formData) {
          if ($scope.form.userForm.$valid) {

            Homepage.signUp(formData).then(function(data)
            {
              if(data.data === "success")
              {
                $window.location.reload();
                $modalInstance.close("closed");
              }

              else
              {
                $scope.err = data.data;
                $modalInstance.close({
                  err : $scope.err[0]
                });
              //  $scope.signIn();
              }

            }, function(data2){
            });

          } else {

          }
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  })



  .controller('ModalInstanceCtrl1', function ($scope, $window, $http, $modalInstance, userForm, Homepage) {
      $scope.form = {}
      $scope.submitForm = function (formData) {
          if ($scope.form.userForm.$valid) {
              Homepage.signIn(formData).then(function(data)
                {
                  if(data.data === "success")
                  {
                    $window.location.reload();
                    $modalInstance.close("closed");
                  }

                  else
                  {
                    $scope.err = data.data;
                    $modalInstance.close({
                      err : $scope.err[0]
                    });
                  //  $scope.signIn();
                  }

                }, function(data2){
                });


          } else {
          }
      };

      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  });
