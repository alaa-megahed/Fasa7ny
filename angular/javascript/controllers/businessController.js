app.controller('businessController', function($scope, $http, Business, $location, $routeParams, $modal, $log) {
  $scope.maxRating = 5;
  $scope.ratedBy = 0;
  $scope.avgRate = 0;
  $scope.sub = "Subscribe";
console.log($routeParams.id);
$scope.id = "58f20e01b38dec5d920104f3";
        Business.get($scope.id)
                .then(function(d) {
                  console.log(d.data.result._id+"!");
                        $scope.business = d.data.result;
                        $scope.phones = d.data.result.phones;
                        $scope.categories = d.data.result.category;
                        $scope.user = d.data.user;
                        $scope.methods = d.data.result.payment_methods;
                        $scope.images = d.data.result.images;

                        $scope.facilities = d.data.facilities;
                        $scope.events = d.data.events; //once events
                        if(d.data.rate) $scope.ratedBy = d.data.rate;
                        $scope.check = 0;
                        $scope.avgRate = d.data.result.average_rating;
                        for(var i = 0; i < d.data.result.subscribers.length; i++) {
                          if(d.data.result.subscribers[i] == d.data.user) {
                              $scope.check = 1;
                              $scope.sub = "Unsubscribe";
                          }
                        }
                      console.log($scope.check);
                      console.log($scope.sub);
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


         $scope.public = function(){
         	console.log('public ctrl');
         	Business.public()
         	.then(function(d){
         		console.log('public done');
         	})
        };

          $scope.remove = function(){
         	console.log('remove ctrl');
         	Business.remove()
         	.then(function(d){
         		console.log('remove done');
         	})
         };

         $scope.getEvent = function(businessId, eventId) {
          console.log("get Event ctrl");
          $location.path('/eventPage/' + businessId + '/' + eventId);
         };

        $scope.createFacility = function(id) {
          console.log("create facility controller");
          $location.path('/createFacility/'+ id);
        };

        $scope.deleteImage = function (image) {
            $scope.message = "Show delete Form Button Clicked";
            console.log($scope.message);
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
            $scope.message = "Show delete Form Button Clicked";
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

        $scope.createOneEvent = function(id) {
          console.log("create event controller"+id);
          $location.path('/createOneEvent/'+ id);
        };


        // $scope.goToEditFacility = function(facilityId) {
        //   console.log("edit facility controller");
        //   $locatin.path('/editFacility/' + facilityId);
        // }

    });

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
