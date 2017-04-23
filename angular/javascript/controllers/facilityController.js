app.controller('facilityController', function($scope, $http, status, Facility, $location, $routeParams, $modal, $log) {

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

	$scope.goToCreate = function() {
		$scope.error = "";
		Facility.createFacility($scope.formData)
		.then(function successCallback(d) {
			console.log("create facility success");
			$location.path('/' + $scope.user);
		},
		function errorCallback(d){
			$scope.error = d.data;
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

		$scope.addDaily = function (facilityId,description,capacity, name) {
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
							},
							name : function(){
								return name;
							}
					}
			});

			modalInstance.result.then(function (selectedItem) {
					$scope.selected = selectedItem;
			});
	};

	$scope.viewEvents = function(facilityId) {
		// Global.facilityId = facilityId;
		$location.path('/viewEvents/' + facilityId);
	}

});

var EditCtrl = function ($scope, $modalInstance, editForm, Facility, $route) {
    $scope.form = {}
    $scope.error = ""
    $scope.submitForm = function (formData, facilityId) {
        // if ($scope.form.editForm.$valid) {
            console.log('user form is in scope');
						console.log(formData);
						console.log(facilityId);
						Facility.editFacility(facilityId, formData)
						.then(function successCallback(d) {
							console.log("done editing facility");
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



var deleteCtrl = function ($scope, $modalInstance, deleteForm, Facility, $route, Business, $http) {
    $scope.form = {};
    $scope.error = "";
    $scope.yes = function (facilityId) {
        // if ($scope.form.editForm.$valid) {
  		Business.getFacilityOccs(facilityId).then(function succcessCallback(response)
						{
							var occs = response.data;
							console.log(occs);
							for (var i = 0; i < occs.length; i++) 
							{
								var bookings = occs[i].bookings;
								for (var j = 0; j < bookings.length; j++) 
								{
									console.log("booking[j] :"+bookings[j]);
									Business.getBooking(bookings[j]).then(function succcessCallback(response)
									{
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
						.then(function successCallback(d) {
							console.log("done deleting facility");
							// $route.reload();
            				$modalInstance.close('closed');

						},
						function errorCallback(d){
							$scope.error = d.data;
						});
						console.log("delete done");
		};

    $scope.no = function () {
        $modalInstance.dismiss('cancel');
    };
};

var addDaily = function ($scope, $modalInstance,Facility,fid,description,capacity,name,$route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.error = "";
    $scope.submitForm = function () {
    	console.log('Add Form');

			var daysOff = [];
			var day = 0;
    	if($scope.formData.day0 == true){daysOff[day] = 0; day++; }
    	if($scope.formData.day1 == true){daysOff[day] = 1; day++; }
    	if($scope.formData.day2 == true){daysOff[day] = 2; day++; }
    	if($scope.formData.day3 == true){ daysOff[day] = 3; day++;}
    	if($scope.formData.day4 == true){ daysOff[day] = 4; day++;}
    	if($scope.formData.day5 == true){ daysOff[day] = 5; day++;}
    	if($scope.formData.day6 == true){ daysOff[day] = 6;}

    	$scope.formData.day = daysOff;

      Facility.addDaily(fid,description,capacity,name,$scope.formData)
      .then(function successCallback(d){
      	console.log('add daily');
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
