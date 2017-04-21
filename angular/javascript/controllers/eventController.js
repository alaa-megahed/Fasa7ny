app.controller('eventController', function($scope, $http, status, Event, $location, $routeParams, $modal,$window, $log) {

	$scope.user = {};
		status.local()
		 .then(function(res){
		   if(res.data){
				 $scope.user = res.data._id;
		     if(res.data.user_type == 1)
		       $scope.type = 1;
		     else if(res.data.user_type == 2)
		       $scope.type  = 4;
		     else $scope.type = 3;
		   }
		   else {
				 $scope.user = res.data._id;
		     status.foreign()
		     .then(function(res){
		       if(res.data.user_type)
		         $scope.type = 1;
		       else $scope.type = 2;
		     });
		   }
		 });

console.log("event eventController");
$scope.error = "";
	Event.get($routeParams.eventId)
	.then(function successCallback(d){
		$scope.business = d.data.business;
		$scope.event = d.data.event;
		$scope.eventocc = d.data.eventocc;
		console.log($scope.event.image);
		if($scope.event.image[0]) $scope.image1 = $scope.event.image[0];
		if($scope.event.image[1]) $scope.image2 = $scope.event.image[1];
		if($scope.event.image[2]) $scope.image3 = $scope.event.image[2];
		if($scope.event.image[3]) $scope.image4 = $scope.event.image[3];
		if($scope.event.image[4]) $scope.image5 = $scope.event.image[4];
		$scope.imageEventlength = $scope.event.image.length;

		if($scope.business != $scope.user) $scope.type = 2;

	}, function errorCallback(d) {
		$scope.error = d.data;
	});

	// $scope.DeleteEvent = function(id,bid){
	// 	console.log('delete event ctrl');
	// 	Event.delete(id)
	// 	.then(function(d){
	// 		$location.path('/'+bid);
	// 	})
	// };

	$scope.showDelete = function (id) {
        $scope.message = "Show Delete Button Clicked";
        console.log($scope.message);
        console.log("Delete");
        var modalInstance = $modal.open({
            templateUrl: 'views/deletePopUp.html',
            controller: DeletePopUp2,
            scope: $scope,
            resolve: {
								bid: function() {
									return $scope.user;
								},
							  id: function(){
                    	return id;
                    }
                }

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            });
    };


    $scope.showForm = function (id) {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);
        console.log("1"+$scope.formData);
        var modalInstance = $modal.open({
            templateUrl: 'views/editEvent.html',
            controller: ModalInstanceCtrl,
            scope: $scope,
            resolve: {
							id: function () {
                        return id;
                    }
                }

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            $window.location.reload();
            });
    };

		$scope.deleteImageEvent = function(eventId, image) {
			$scope.message = "Show delete Form Button Clicked";
			console.log($scope.message);
			console.log(image);
			$scope.image = image;
			$scope.eId = eventId;
			var modalInstance = $modal.open({
					templateUrl: 'views/deleteImageEvent.html',
					controller: deleteImageEventCtrl,
					scope: $scope
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
					$window.location.reload();
			}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
		};

		$scope.addImageEvent = function (eventId) {
				$scope.message = "Show image Form Button Clicked";
				$scope.eId = eventId;
				console.log($scope.message);
				console.log($scope.eId);
				var modalInstance = $modal.open({
						templateUrl: 'views/addImageEvent.html',
						controller: addImageEventCtrl,
						scope: $scope
				});

				modalInstance.result.then(function (selectedItem) {
						$scope.selected = selectedItem;
						$window.location.reload();
				}, function () {
						$log.info('Modal dismissed at: ' + new Date());
				});
		};


});
var DeletePopUp2 = function ($scope, $location, $modalInstance,Event,id,bid, $route,$window) {
    $scope.form = {};
		$scope.error = "";
    $scope.submitForm = function () {
    	console.log('Delete Form');
        Event.delete(id)
				.then(function successCallback(d) {
          console.log("done deleting event");
          $route.reload();
					console.log(bid);
					$location.path('/business/' + bid);
					// $window.location = "/" + bid;
        },
        function errorCallback(d){
					console.log("??");
					$scope.error = d.data;
        });
        console.log('del');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};



var ModalInstanceCtrl = function ($scope, $modalInstance, status, Event,id, $route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.error = "";
    $scope.submitForm = function () {
         if(($scope.formData.starttime && !$scope.formData.endtime) || (!$scope.formData.starttime && $scope.formData.endtime)){
            $scope.error = "Must enter both a start date and end date";
        }
        else {
        	console.log('Submit Form'+$scope.formData);
            Event.edit($scope.formData,id)
            .then(function successCallback(d){
            	console.log('yas');
              $route.reload();
              $modalInstance.close('closed');
            }, function errorCallback(d) {
              $scope.error = d.data;
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};


var deleteImageEventCtrl = function ($scope, $modalInstance, Event, $route) {
		$scope.form = {}
		$scope.yes = function (eventId, image) {
				// if ($scope.form.editForm.$valid) {
						console.log('user form is in scope');
						console.log(image);
						Event.deleteImage(eventId, image)
						.then(function(d) {
							console.log("done deleting image event");
						});
						$route.reload();
						$modalInstance.close('closed');
		};

		$scope.no = function () {
				$modalInstance.dismiss('cancel');
		};
};

var addImageEventCtrl = function ($scope, $modalInstance, Event, $route, $window) {
		$scope.addImageEvent = function (eventId, formData) {
						console.log('add image is in scope');
						console.log(eventId);
						console.log(formData);
						Event.addImage(eventId, formData)
						.then(function successCallback(d) {
		          console.log("changeImage done");
		          $window.location.reload();
		        },
		        function errorCallback(d){
							console.log("error");
		          $scope.error = d.data;
		        });
						// console.log("eh yasta?");
						// $route.reload();
						// $route.reload();
		};

		$scope.no = function () {
				$modalInstance.dismiss('cancel');
		};
};
