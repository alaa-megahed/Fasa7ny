var app = angular.module('fasa7ny');
app.controller('businessController', function($scope, $http, Business, $location, $routeParams, $modal, $log, $window) {

  $scope.maxRating = 5;
  $scope.ratedBy = 0;
  $scope.avgRate = 0;
  $scope.sub = "Subscribe";
  $scope.id = "58f0f3faaa02d151aa4c987c";

  Business.get($scope.id)
  .then(function(d) {
    console.log("First then "+d.data.result);
    $scope.business = d.data.result;

    $scope.phones = d.data.result.phones;
    $scope.phonelength = 0; //zero means that the business has more than one phone number
    if($scope.phones.length == 1) $scope.phonelength = 1;

    $scope.methods = d.data.result.payment_methods;
    $scope.paymentlength = 0; //zero means that the business has more than one payment method
    if($scope.methods.length == 1) $scope.paymentlength = 1;

    console.log($scope.paymentlength);
    $scope.categories = d.data.result.category;
    $scope.user = d.data.user;
    // $scope.images = d.data.result.images;

    $scope.facilities = d.data.facilities;
    $scope.events = d.data.events; //once events
    if(d.data.rate) $scope.ratedBy = d.data.rate;
    $scope.avgRate = d.data.result.average_rating;

    $scope.check = 0;
    for(var i = 0; i < d.data.result.subscribers.length; i++) {
      if(d.data.result.subscribers[i] == d.data.user) {
          $scope.check = 1;
          $scope.sub = "Unsubscribe";
      }

      $window.name = $scope.business.name;
    }



    if(d.data.result.images[0]) $scope.image1 = d.data.result.images[0];
    if(d.data.result.images[1]) $scope.image2 = d.data.result.images[1];
    if(d.data.result.images[2]) $scope.image3 = d.data.result.images[2];
    if(d.data.result.images[3]) $scope.image4 = d.data.result.images[3];
    if(d.data.result.images[4]) $scope.image5 = d.data.result.images[4];

    console.log($scope.image1);
    console.log($scope.image2);
    console.log($scope.image3);
    console.log($scope.image4);
    console.log($scope.image5);

    // console.log($scope.check);
    // console.log($scope.sub);
  });




         $scope.goToEdit = function() {
         	console.log("controller");
         	Business.edit($scope.formData)
         	.then(function(d) {
            console.log(d.data);
         		console.log(d.data.business._id);
            $location.path('/'+ d.data.business._id);
         	})
         };

         $scope.subscribe = function(id) {
         	console.log("controller subscribe");
         	Business.subscribe(id)
         	.then(function(d) {
         		console.log("sub done");
            $scope.sub = "Unsubscribe";
            $scope.check = 1;
         	})
        };

         $scope.unsubscribe = function(id) {
           console.log("controller unsubscribe");
           Business.unsubscribe(id)
           .then(function(d) {
             console.log("unsub done");
             $scope.sub = "Subscribe";
             $scope.check = 0;
           })
         };

         $scope.rateBy = function (star, bid) {
           console.log(star+"!");
           Business.rate(star, bid)
           .then(function(d) {
             console.log("rating done");
             $scope.avgRate = d.data.average_rating;
             console.log($scope.avgRate);
             console.log(d.data.average_rating);
             $scope.ratedBy = star;
           });
         };


        //  $scope.public = function(){
        //  	console.log('public ctrl');
        //  	Business.public()
        //  	.then(function(d){
        //  		console.log('public done');
        //  	})
        // };


        $scope.public = function () {
        $scope.message = "Public Button Clicked";
        console.log($scope.message);
        var modalInstance = $modal.open({
            templateUrl: 'views/publicPop.html',
            controller: Public,
            scope: $scope

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            });
    };

         //  $scope.remove = function(){
         // 	console.log('remove ctrl');
         // 	Business.remove()
         // 	.then(function(d){
         // 		console.log('remove done');
         // 	})
         // };


        $scope.remove = function () {
          $scope.message = "Remove Button Clicked";
          console.log($scope.message);

          Business.hasBookings().then(function(responce)
          {
            if(responce.data != 0)
            {
              
              var notAllowedModalInstance = $modal.open({
                  templateUrl: 'views/notAllowedRemovePop.html',
                  controller: NotAllowedRemove,
                  scope: $scope

              });

              modalInstance.result.then(function (selectedItem) {
                  $scope.selected = selectedItem;
                  });
            }
            else
            {

              var modalInstance = $modal.open({
                  templateUrl: 'views/removePop.html',
                  controller: Remove,
                  scope: $scope

              });

              modalInstance.result.then(function (selectedItem) {
                  $scope.selected = selectedItem;
                  });
              }
         });

    };


         $scope.getEvent = function(businessId, eventId) {
          console.log("get Event ctrl");
          $location.path('/eventPage/' + businessId + '/' + eventId);
         };

        $scope.createFacility = function(id) {
          console.log("create facility controller");
          $location.path('/createFacility/'+ id);
        };


        $scope.createOffer = function(id) {
          console.log("create offer controller");
          $location.path('/createOffer/'+ id);
        };

        $scope.deleteImage = function (image) {
            $scope.message = "Show delete Form Button Clicked";
            console.log($scope.message);
            console.log(image);
            $scope.image = image;
            var modalInstance = $modal.open({
                templateUrl: 'views/deleteImage.html',
                controller: deleteImageCtrl,
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.addImage = function () {
            $scope.message = "Show image Form Button Clicked";
            console.log($scope.message);
            var modalInstance = $modal.open({
                templateUrl: 'views/addImage.html',
                controller: addImageCtrl,
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deletePhone = function (phone) {
            $scope.message = "Show delete Form Button Clicked";
            console.log($scope.message);
            console.log(phone);
            $scope.phone = phone;
            var modalInstance = $modal.open({
                templateUrl: 'views/deletePhone.html',
                controller: deletePhoneCtrl,
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.deletePaymentMethod = function (method) {
            $scope.message = "Show delete Form Button Clicked";
            console.log($scope.message);
            console.log(method);
            $scope.method = method;
            var modalInstance = $modal.open({
                templateUrl: 'views/deletePaymentMethod.html',
                controller: deletePaymentMethodCtrl,
                scope: $scope
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        $scope.createOneEvent = function(id) {
          console.log("create event controller"+id);
          $location.path('/createOneEvent/'+ id);
        };

        $scope.schedule = function(id) {
           console.log("schedule controller");
           $location.path('/schedule/' + id);
       }

        // $scope.goToEditFacility = function(facilityId) {
        //   console.log("edit facility controller");
        //   $locatin.path('/editFacility/' + facilityId);
        // }

    });


var Public = function ($scope, $modalInstance,Business,$route) {
    $scope.form = {}
    $scope.submitForm = function () {
      console.log('Public Form');
        Business.public()
        .then(function(d){
          console.log('pub');
        });
        $route.reload();
        $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var Remove = function ($scope, $modalInstance,Business,$route) {
    $scope.form = {}
    $scope.submitForm = function () {
      console.log('Remove Form');   
        Business.remove()
        .then(function(d){
          console.log('rem');
        });
        $route.reload();
        $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var NotAllowedRemove = function ($scope, $modalInstance,Business,$route) {
    $scope.form = {}
    $scope.submitForm = function () {
        $route.reload();
        $modalInstance.close('closed');
    };
};



    var deleteImageCtrl = function ($scope, $modalInstance, Business, $route) {
        $scope.form = {}
        $scope.yes = function (image) {
            // if ($scope.form.editForm.$valid) {
                console.log('user form is in scope');
    						console.log(image);
    						Business.deleteImage(image)
    						.then(function(d) {
    							console.log("done deleting image");
    						});
    						$route.reload();
                $modalInstance.close('closed');
        };

        $scope.no = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var addImageCtrl = function ($scope, $modalInstance, Business, $route) {
        $scope.addImage = function (formData) {
                console.log('add image is in scope');
                Business.addImage(formData)
                .then(function(d) {
                  console.log("done adding image");
                });
                console.log("eh yasta?");
                $route.reload();
                $modalInstance.close('closed');
        };

        $scope.no = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var deletePhoneCtrl = function ($scope, $modalInstance, Business, $route) {
        $scope.yes = function (phone) {
                console.log('delete phone is in scope');
                Business.deletePhone(phone)
                .then(function(d) {
                  console.log("done deleting phone");
                });
                console.log("eh yasta?");
                $route.reload();
                $modalInstance.close('closed');
        };

        $scope.no = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    var deletePaymentMethodCtrl = function ($scope, $modalInstance, Business, $route) {
        $scope.yes = function (method) {
                console.log('delete payment method is in scope');
                Business.deletePaymentMethod(method)
                .then(function(d) {
                  console.log("done deleting payment_method");
                });
                console.log("eh yasta?");
                $route.reload();
                $modalInstance.close('closed');
        };

        $scope.no = function () {
            $modalInstance.dismiss('cancel');
        };
    };
