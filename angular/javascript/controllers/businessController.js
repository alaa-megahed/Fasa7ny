app.controller('businessController', function($scope, status,$http, Business, $location, $routeParams, $modal, $log) {


  status.local()
  .then(function(res){
    if(res.data){
      if(res.data.user_type == 1)
        $scope.type = 1;
      else if(res.data.user_type == 2)
        $scope.type  = 4;
      else $scope.type = 3;
    }
    else {
      status.foreign()
      .then(function(res){
        if(res.data.user_type)
          $scope.type = 1;
        else $scope.type = 2;
      });
    }
  });

  // $scope.type = 2; //unregistered user or business visiting another business

console.log($routeParams.name);

  $scope.maxRating = 5;
  $scope.ratedBy = 0;
  $scope.avgRate = 0;
  $scope.sub = "Subscribe";
  $scope.imagelength = 0;
  $scope.business = {};
  $scope.slides = [];
  $scope.facilities = [];
  $scope.facilitylength = 0;

  $scope.events = []; //once events
  $scope.eventlength = 0;

  Business.get($routeParams.name)
  .then(function(d) {
    console.log("then");
    status.local()
    .then(function(res) {
      if(res.data) {
        if(res.data.user_type == 1) {
          $scope.type = 1;
          if(d.data.rate) $scope.ratedBy = d.data.rate;

          $scope.check = 0;
          for(var i = 0; i < d.data.result.subscribers.length; i++) {
            if(d.data.result.subscribers[i] == d.data.user) {
                $scope.check = 1;
                $scope.sub = "Unsubscribe";
            }
            $window.name = $scope.business.name;
          }
        }
        else if(res.data.user_type == 3) {
          $scope.type = 3;
        }
        else if(res.data.user_type == 2) {
          if(res.data._id == d.data.result._id) {
            $scope.type = 4;
          } else {
            $scope.type = 2;
          }
        } else $scope.type = 2;
      }
      else {
        status.foreign()
        .then(function(res){
          if(res.data) {
            if(res.data.user_type == 1) {
              $scope.type = 1;
              if(d.data.rate) $scope.ratedBy = d.data.rate;

              $scope.check = 0;
              for(var i = 0; i < d.data.result.subscribers.length; i++) {
                if(d.data.result.subscribers[i] == d.data.user) {
                    $scope.check = 1;
                    $scope.sub = "Unsubscribe";
                }
                $window.name = $scope.business.name;
              }
            }
            else if(res.data.user_type == 3) {
              $scope.type = 3;
            }
            else if(res.data.user_type == 2) {
              if(res.data._id === d.data.result.id) {
                $scope.type = 4; //my business page
              } else {
                $scope.type = 2; //business visiting another business' page
              }
            } else $scope.type = 2;
          }
          else{
             $scope.type = 2;
          }
        });
      }

    });

    console.log(d.data.result);
    $scope.business = d.data.result;

    $scope.phones = d.data.result.phones;
    $scope.phonelength = 0; //zero means that the business has more than one phone number
    if($scope.phones.length == 1) $scope.phonelength = 1;

    $scope.methods = d.data.result.payment_methods;
    $scope.paymentlength = 0; //zero means that the business has more than one payment method
    if($scope.methods.length == 1) $scope.paymentlength = 1;

    console.log($scope.paymentlength);
    $scope.categories = d.data.result.category;
    // $scope.user = d.data.user;
    // $scope.images = d.data.result.images;

    $scope.facilities = d.data.facilities;
    $scope.facilitylength = d.data.facilities.length;

    $scope.events = d.data.events; //once events
    $scope.eventlength = d.data.events.length;

    $scope.avgRate = d.data.result.average_rating;
    $scope.slides = $scope.business.images;
    $scope.imagelength = $scope.business.images.length;
    console.log("images: ",$scope.slides);
    // console.log($scope.check);
    // console.log($scope.sub);
  });


          $scope.goToEdit = function() {
          $scope.error = "";
             console.log("controller"+ $scope.formData);
             Business.edit($scope.formData)
             .then(function successCallback(d) {
            // console.log(d.data.business);
                 console.log("Yasmine"+d.data.business.name);
            $location.path('/business/'+ d.data.business.name);
         	},
          function errorCallback(d){
            $scope.error = d.data;
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

          $scope.businessEdit = function(){
           	console.log('businessedit ctrl');
            $location.path('/editBusiness');
         };


        $scope.remove = function () {
          $scope.message = "Remove Button Clicked";
          console.log($scope.message);
          var modalInstance = $modal.open({
              templateUrl: 'views/removePop.html',
              controller: Remove,
              scope: $scope

          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
          });
        };


         $scope.getEvent = function(eventId) {
          console.log("get Event ctrl");
          $location.path('/eventPage/' + eventId);
         };

        $scope.createFacility = function(id) {
          console.log("create facility controller");
          $location.path('/createFacility/'+ id);
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
                $scope.business = selectedItem.business;
                $scope.slides = $scope.business.images;
                $scope.imagelength = $scope.business.images.length;
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
                $scope.business = selectedItem.business;
                $scope.slides = $scope.business.images;
                console.log("NEWW" + $scope.slides);
                $scope.imagelength = $scope.business.images.length;

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

        $scope.schedule = function(name) {
           $location.path('/schedule/' + name);
       };

       $scope.changeImage = function() {
         $scope.error = "";
        console.log("changeImage controller");
        console.log($scope.formData);
        Business.changeImage($scope.formData)
        .then(function successCallback(d) {
          console.log("changeImage done");
          $route.reload();
        },
        function errorCallback(d){
          $scope.error = d.data;
        });
       }
    });


    var Public = function ($scope, $modalInstance,Business,$route) {
        $scope.form = {}
        $scope.error = "";
        $scope.submitForm = function () {
          console.log('Public Form');
            Business.public()
            .then(function successCallback(d){
              console.log('pub');
              $route.reload();
            $modalInstance.close('closed');
            },
            function errorCallback(d){
              $scope.error = d.data;
            });

        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };


    var Remove = function ($scope, $modalInstance,Business,$route) {
        $scope.form = {}
        $scope.error = "";
        $scope.submitForm = function () {
          console.log('Remove Form');
            Business.remove()
            .then(function successCallback(d){
              console.log('rem');
              $route.reload();
            $modalInstance.close('closed');
            },
            function errorCallback(d){
              $scope.error = d.data;
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };



    var deleteImageCtrl = function ($scope, $modalInstance, Business, $route) {
        $scope.form = {};
        $scope.error = "";
        $scope.yes = function (image) {
          console.log('user form is in scope');
					console.log(image);
					Business.deleteImage(image)
					.then(function successCallback(d) {
            console.log(d.data.business);
            console.log('image business deleted!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
            $modalInstance.close({
              business:d.data.business
            });
					}, function errorCallback(d) {
            $scope.error = d.data;
          });
          // $location.path("/business/");
          // $route.reload();
          // console.log("????????????????????????????????");
        };

        $scope.no = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var addImageCtrl = function ($scope, $modalInstance, Business, $route) {
      $scope.error = "";
        $scope.addImage = function (formData) {
                console.log('add image is in scope');
                Business.addImage(formData)
                .then(function successCallback(d) {
                  // $scope.business = business;
                  // business = d.data.business;

                  $modalInstance.close({
                    business : d.data.business
                  });
                  // console.log(d.data.business);

                }, function errorCallback(d) {
                  $scope.error = d.data;
                });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    };

    var deletePhoneCtrl = function ($scope, $modalInstance, Business, $route) {
          $scope.error = "";
            $scope.yes = function (phone) {
                    console.log('delete phone is in scope');
                    Business.deletePhone(phone)
                    .then(function successCallback(d) {
                      console.log("done deleting phone");
                       $route.reload();
                       $modalInstance.close('closed');
                    },
                    function errorCallback(d){
                      $scope.error = d.data;
                    });

            };

            $scope.no = function () {
                $modalInstance.dismiss('cancel');
            };
    }

        var deletePaymentMethodCtrl = function ($scope, $modalInstance, business, Business, $route) {
          $scope.error = "";
            $scope.yes = function (method) {
                    console.log('delete payment method is in scope');
                    Business.deletePaymentMethod(method)
                    .then(function successCallback(d) {
                      $scope.business = business;
                      $scope.business = d.data.business;
                      console.log("done deleting payment_method");
                       $route.reload();
                    $modalInstance.close('closed');
                    },
                    function errorCallback(d){
                      $scope.error = d.data;
                    });

            };

            $scope.no = function () {
                $modalInstance.dismiss('cancel');
            };
}
