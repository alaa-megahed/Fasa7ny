angular.module('fasa7ny')

  .controller('navbarController' , function($q, $scope, $http, $location, $window, $modal, $modalStack, $log, Homepage, status,Global, $route) {

    $scope.user = {};
    $scope.err = "";
    $scope.form = {};
    $scope.searchAppear = 1;
    $scope.type = -1;
    $scope.notifcolor = {'color' : 'white'} ;
    $scope.category1 = "thrill";
    $scope.category2 = "outlet";
    $scope.category3 = "escape";

    // var user = Global.getUser();

    // console.log(user);
    $scope.getHome = function() {
      $window.location = "/";
      // $location.path("/");// get back to this after ads
    }

    $scope.viewAll = function() {
      console.log("VIEW ALL");
      $location.path('/view-all');
    }

    $scope.goToSearch = function(category)
    {
      $location.path("/search/" + category);
    }

    $scope.personalProfile = function(){
      $location.path('/profile');
    }

    // conasole.log(user);
    $scope.getAdminProfile = function()
    {
      $location.path('/webAdminProfile');
    }


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
                if($scope.err1 === "The username or email provided is already taken."|| $scope.err1 === "Please enter all the required information in a vaild form." )
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
     $window.location = $window.location.protocol + "//" + "54.187.92.64:3000/auth/facebook";

    }

    $scope.google = function() {
       $window.location = $window.location.protocol + "//" + "54.187.92.64:3000/auth/google";
    }

    $scope.logout = function() {

      console.log($scope.type);
      if(!$scope.type)
      {
        Homepage.logoutLocal().then(function(result){
          $location.url('/');
          $scope.updateUser();
        })
      }
      else {
        Homepage.logout().then(function(result)
        {
            console.log(result);
            $location.path('/');
            $scope.updateUser();
        })
      }
    }

      $scope.getHome = function() {
        $location.path("/");// get back to this after ads
      }

      $scope.getSearch = function() {
        console.log("hiii");
        $scope.searchAppear = 1;
      }


    $scope.goToBusinessPage = function(id) {
      console.log("yellehwiii");
      console.log(id);
      $location.path('/business/'+id);
    }

    $scope.getNotifications = function(){
      console.log("hiii");
      $location.path('/user/notifications');
    }





  })


  .controller('ModalInstanceCtrl', function ($scope, $http, $window, $modalInstance, userForm, Homepage, $route) {
      $scope.form = {};
      $scope.err = "";

      $scope.submitForm = function (formData) {
          if ($scope.form.userForm.$valid) {

            if(!$scope.formData.name)
              $scope.err = "Please enter name.";
            else if(!$scope.formData.password || $scope.formData.password.length < 8)
              $scope.err = "Please enter a vaild password.";
            else if(!$scope.formData.email)
              $scope.err = "Please enter email.";
            else if(!$scope.formData.phone)
              $scope.err = "Please enter phone.";
            else if(!$scope.formData.birthdate)
              $scope.err = "Please enter a birthdate.";
            else if($scope.formData.gender != "Male" && $scope.formData.gender != "Female" && $scope.formData.gender != "Other" && $scope.formData.gender != null)
              $scope.err = "Please enter either Male, Female,Other or leave gender field empty."
            else
            {
              for(var i = 0; i < $scope.formData.phone.length; i++)
                if(isNaN($scope.formData.phone[i]))
                  $scope.err = "Please enter a valid phone number.";

            }



            Homepage.signUp(formData).then(function(data)
            {

              if(data.data === "success")
              {
                // $window.location.reload();
                $route.reload();
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




  .controller('ModalInstanceCtrl1', function ($scope, $window, $http, $modal,$modalInstance, userForm, Homepage, $route) {
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
                  $route.reload();
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
