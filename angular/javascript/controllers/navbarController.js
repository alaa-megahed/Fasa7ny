angular.module('fasa7ny')

  .controller('navbarController' , function($q, $scope, $http, $location, $window, $modal, $modalStack, $log, Homepage, status) {

    $scope.user = {};
    $scope.err = "";
    $scope.form = {};
    $scope.type = -1;
    $scope.notifcolor = {'color' : 'white'} ;

    // var user = Global.getUser();
    // console.log(user);



    $scope.updateUser = function()
    {
      status.local().then(
        function(result)
             {
               $scope.user = result;

               if($scope.user.data)
               {
                 console.log("Data is " + JSON.stringify(result));
                  $scope.type = 0;
                  if($scope.user.data.notifications)
                  {
                    $scope.user.data.notifications.reverse();
                    $scope.notifications =  $scope.user.data.notifications.slice(1,11);
                  }

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

    }

    $scope.updateUser();


    $scope.getAdvertisements = function()
    {
      Homepage.getAds().then(function successfulCallback(result){

        $scope.advertisements = result.data;

        //shuffle array to choose random 6 ads
        var j, x, i;
        for (i = $scope.advertisements.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = $scope.advertisements[i - 1];
            $scope.advertisements[i - 1] = $scope.advertisements[j];
            $scope.advertisements[j] = x;
        }


        $scope.advertisements =  $scope.advertisements.slice(1,9);




      });
    }

    $scope.getAdvertisements();

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
                else {
                  $scope.updateUser();
                }
                }, function () {
                  $log.info('Modal dismissed at: ' + new Date());
                });


    }

    $scope.search = function(){

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

    }

    $scope.google = function(){
       $window.location = $window.location.protocol + "//" + "localhost:3000/auth/google";
    }

    $scope.logout = function(){


      if(!$scope.type)
      {
        Homepage.logoutLocal().then(function(result){

          $location.url('/');
          $scope.updateUser();

        })
      }
      else {
        $scope.user = null;
        Homepage.logout().then(function(result)
        {
            console.log(result);
            $location.path("/");
        })
      }

    }

    $scope.getHome = function()
    {

      console.log("home");
      $location.url('/');// get back to this after ads

    }


    $scope.goToBusinessPage = function(name) {
      console.log(name);
      $location.path('/business/'+name);
    }

    $scope.getNotifications = function(){
      $location.path('/user/notifications');
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
            console.log("signin");
            console.log($scope.formData);
              Homepage.signIn($scope.formData).then(function(data){
                console.log("Return data "  + JSON.stringify(data));
                if(data.data === "success")
                {
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
