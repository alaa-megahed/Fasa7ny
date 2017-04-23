app.controller('eventController', function($scope, $http, status, Event,Global, $location, $routeParams,occurrenceBookings,viewOccurences, $modal,$window) {

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
          Global.setBusiness(Global.getBusiness());
          console.log("business in event "+Global.getBusiness());
          Global.setOnceEvent($routeParams.eventId); //hayefdal fel url?

console.log("event eventController");
$scope.error = "";
	Event.get($routeParams.eventId)
	.then(function successCallback(d){
		$scope.business = d.data.business;
		$scope.event = d.data.event;
		$scope.eventocc = d.data.eventocc;

	  if($scope.type == 4 && $scope.business != $scope.user) $scope.type = 2;
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
    }


    $scope.bookEvent = function(){
            Global.setBusiness(Global.getBusiness()); //get business from event, id in url
            $location.path('/book-event');
          };

     $scope.viewEventBookings = function(eventId)
     {
        viewOccurences.get(eventId).then(function (response) {
        $scope.event_occ = response.data.eventocc[0]._id;
        $location.path('/bookings/'+$scope.event_occ); // /bookings/:onceEventOcc

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
