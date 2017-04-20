angular.module('fasa7ny')

  .controller('navbarController' , function($q, $scope, $http, $location, $window, $modal, $modalStack, $log, Homepage, status) {

    $scope.user = {};
    $scope.err = "";
    $scope.form = {};
    $scope.searchAppear = 1;
    $scope.type = -1;
    $scope.notifcolor = {'color' : 'white'} ;


    status.local().then(
      function(result)
           {
             $scope.user = result;
             console.log("Data is " + JSON.stringify(result));
             if($scope.user.data)
             {
                console.log($scope.user.data.notifications);
                $scope.type = 0;
                $scope.user.data.notifications.reverse();
                $scope.notifications =  $scope.user.data.notifications.slice(1,11);
                if($scope.user.data.unread_notifications)
                    $scope.notifcolor = {'color' : 'red'};
                $scope.type = 0;
              }

              if(!$scope.user.data)
              {
                var deferred = $q.defer();
                status.foreign().then(function(result){
                  $scope.user = result;
                  if($scope.user.data)
                  {
                     $scope.type = 1;
                     $scope.user.data.notifications.reverse();
                     $scope.notifications =  $scope.user.data.notifications.slice(1,11);
                     if($scope.user.data.unread_notifications)
                         $scope.notifcolor = {'color' : 'red'};
                   }

                  deferred.resolve(result);
                 console.log("response is " + JSON.stringify(deferred.promise));
                },function(response){
                  deferred.reject();
                  $location.path('/');
                });

              }


           });






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


    $scope.search = function(){

      $scope.searchAppear = 0;
      console.log($scope.form.search);
      $location.url('/search/'+$scope.form.search);

    }

    $scope.decreaseCount = function(){

      $scope.notifcolor = {'color' : 'white'} ;
      Homepage.resetUnread();

    }

    $scope.searchCategory = function(category){
      console.log("category issss" + category);
    }

    $scope.facebook = function(){
     $window.location = $window.location.protocol + "//" + "localhost:3000/auth/facebook";
    //   Homepage.facebook().then(function(){
    //       $window.location.reload();
    // });
    }

    $scope.google = function(){
       $window.location = $window.location.protocol + "//" + "localhost:3000/auth/google";
    }

    $scope.logout = function(){

      $scope.user = null;
      console.log($scope.type);
      if(!$scope.type)
      {
        Homepage.logoutLocal().then(function(result){

        })
      }
      else {
        Homepage.logout().then(function(result)
        {
            console.log(result);
        })
      }





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




  .controller('ModalInstanceCtrl1', function ($scope, $window, $http, $modal,$modalInstance, userForm, Homepage) {
      $scope.form = {};
      $scope.formData = {};
      $scope.forgot = 0;


      $scope.submitForm = function () {
          if ($scope.form.userForm.$valid) {
            console.log($scope.formData);
              Homepage.signIn($scope.formData).then(function(data){
                console.log("Return data "  + JSON.stringify(data));
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



             });


          } else {

          }
      };

      $scope.forgotPassword = function () {
        $scope.forgot = 1;
        var modalInstance = $modal.open({
                  templateUrl: 'views/forgotpassword-form.html',
                  controller: 'ModalInstanceCtrl2'
              });


      };


      $scope.cancel = function () {
          $modalInstance.dismiss('cancel');
      };
  })



  .controller('ModalInstanceCtrl2', function ($scope, $timeout, $window, $modalStack, $http,$modalInstance, Homepage) {
        $scope.form = {};
        $scope.submitForm = function (formData) {
            console.log(formData);
                Homepage.forgotPassword(formData).then(function(data)
                  {
                    $scope.err = "";
                    $scope.success = "";

                    console.log(JSON.stringify(data));
                    if(data.data.startsWith("An e-mail has been sent to "))
                    {
                        console.log("hello");
                        $scope.success = data.data;
                        $timeout(function() {
                            $modalStack.dismissAll();
                        }, 1000);
                    }

                    else {
                      $scope.err = data.data;
                    }




                  }, function(data2){
                  });



        };
        $scope.cancel = function (reason) {
              $modalStack.dismissAll();
        };
    });
