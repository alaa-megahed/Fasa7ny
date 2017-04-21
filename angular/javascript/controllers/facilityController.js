app.controller('facilityController', function($scope, $http, Facility, $location, $routeParams, $modal, $log) {

	$scope.goToCreate = function() {
		Facility.createFacility($scope.formData)
		.then(function(d) {
			console.log("create facility success");
			$location.path('/');
		});
	};


	$scope.goToEditFacility = function (facilityId) {
			$scope.message = "Show edit Form Button Clicked";
			console.log($scope.message);
			$scope.facilityId = facilityId;
			var modalInstance = $modal.open({
					templateUrl: 'views/editFacility.html',
					controller: EditCtrl,
					scope: $scope,
					resolve: {
							editForm: function () {
									return $scope.editForm;
							}
					}
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
			}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
	};

	$scope.deleteFacility = function (facilityId) {
			$scope.message = "Show edit Form Button Clicked";
			console.log($scope.message);
			$scope.facilityId = facilityId;
			var modalInstance = $modal.open({
					templateUrl: 'views/deleteFacility.html',
					controller: deleteCtrl,
					scope: $scope,
					resolve: {
							deleteForm: function () {
									return $scope.deleteForm;
							}
					}
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
			}, function () {
					$log.info('Modal dismissed at: ' + new Date());
			});
	};

		$scope.addDaily = function (facilityId,description,capacity) {
			$scope.message = "Show add Form Button Clicked";
			console.log($scope.message);
			$scope.facilityId = facilityId;
			var modalInstance = $modal.open({
					templateUrl: 'views/addDailyEvent.html',
					controller: addDaily,
					scope: $scope,
					resolve: {
							fid: function () {
									return facilityId;
							},
							description: function(){
								return description;
							},
							capacity : function(){
								return capacity;
							}
					}
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
			});
	}

});

var EditCtrl = function ($scope, $modalInstance, editForm, Facility, $route) {
    $scope.form = {}
    $scope.submitForm = function (formData, facilityId) {
        // if ($scope.form.editForm.$valid) {
            console.log('user form is in scope');
						console.log(formData);
						console.log(facilityId);
						Facility.editFacility(facilityId, formData)
						.then(function(d) {
							console.log("done editing facility");
						});
						$route.reload();
            $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

var deleteCtrl = function ($scope, $modalInstance, deleteForm, Facility, $route, Business, $http) {
    $scope.form = {};
    $scope.yes = function (facilityId) {
        // if ($scope.form.editForm.$valid) {
            console.log('user form is in scope');
						console.log(facilityId+"!!");
						Business.getFacilityOccs(facilityId).then(function succcessCallback(response)
						{
							var occs = response.data;
							console.log(occs);
							for (var i = 0; i < occs.length; i++) 
							{
								var bookings = occs[i].bookings;
								console.log("bookings lamma bagebha mn occs[i] "+bookings);
								for (var j = 0; j < bookings.length; j++) 
								{
									console.log("booking[j] :"+bookings[j]);
									Business.getBooking(bookings[j]).then(function succcessCallback(response)
									{
										console.log("2abl cur booking1  "+response.data.id);
										console.log("2abl cur booking2  "+response.data._id);
										var cur_booking = response.data;

										console.log("cur booking zat nafso :"+cur_booking);
			
										$http.post('http://127.0.0.1:3000/bookings/cancel_booking_after_delete', {booking_id: cur_booking._id})
												.then(function successCallback(response){
											            console.log(response.data);
											     }, function errorCallback(response){
											            console.log(response.data);
												});

										}, function errorCallback(response){
										      console.log(response.data);
									});
								}
							}
						}, function errorCallback(response)
						{
							console.log(response.data);
						});

						Facility.deleteFacility(facilityId)
						.then(function(d) {
							console.log("done deleting facility");
						});
						console.log("delete done");
						$route.reload();
            $modalInstance.close('closed');
    };

    $scope.no = function () {
        $modalInstance.dismiss('cancel');
    };
};

var addDaily = function ($scope, $modalInstance,Facility,fid,description,capacity,$route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.submitForm = function () {
    	console.log('Add Form');
        Facility.addDaily(fid,description,capacity,$scope.formData)
        .then(function(d){
        	console.log('add daily');
        });
        $route.reload();
        $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

