angular.module('fasa7ny')

  .controller('homepageController' , function($scope, $http, $location, $window, $modal, $modalStack, $log, Homepage) {

    $scope.user = {};
    $scope.err = "";
    $scope.form = {};
    $scope.searchAppear = 1;
    $scope.notifcolor = {'color' : 'white'} ;



    $http({
     url: 'http://127.0.0.1:3000/loggedin',
     method: "GET",
     withCredentials: true,
     headers: {
                 'Content-Type': 'application/json; charset=utf-8'
     }
   }).then(function(result)
       {
         $scope.user = result;
         console.log("Data is " + JSON.stringify(result));
         if($scope.user.data)
         {
            console.log($scope.user.data.notifications);
            $scope.user.data.notifications.reverse();
            $scope.notifications =  $scope.user.data.notifications.slice(1,11);
            if($scope.user.data.unread_notifications)
                $scope.notifcolor = {'color' : 'red'};
          }



       })


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
              $http({
               url: 'http://127.0.0.1:3000/auth/login',
               method: "POST",
               withCredentials: true,
               data: {username : $scope.formData.username, password : $scope.formData.password},
               headers: {
                           'Content-Type': 'application/x-www-form-urlencoded'
               },
               transformRequest: function(obj) {
                   var str = [];
                   for(var p in obj)
                   str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                   return str.join("&");
               }
             }).then(function(data){
               console.log(JSON.stringify(data));
               $window.location.reload();
               $modalInstance.close("closed");


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
