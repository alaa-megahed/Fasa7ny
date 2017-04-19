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

var deleteCtrl = function ($scope, $modalInstance, deleteForm, Facility, $route) {
    $scope.form = {}
    $scope.yes = function (facilityId) {
        // if ($scope.form.editForm.$valid) {
            console.log('user form is in scope');
						console.log(facilityId+"!!");
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

var addDaily = function ($scope, $modalInstance,Facility,fid,description,capacity,name,$route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.submitForm = function () {
    	console.log('Add Form');

			var daysOff = [];
			var day = 0;
    	if($scope.formData.day0 == true)
    	{
				daysOff[day] = 0;
				day++;
			}

    	if($scope.formData.day1 == true)
    	{
				daysOff[day] = 1;
				day++;
			}

    	if($scope.formData.day2 == true)
    	{
				daysOff[day] = 2;
				day++;
			}

    	if($scope.formData.day3 == true)
    	{
				daysOff[day] = 3;
				day++;
			}

    	if($scope.formData.day4 == true)
    	{
				daysOff[day] = 4;
				day++;
			}

    	if($scope.formData.day5 == true)
    	{
				daysOff[day] = 5;
				day++;
			}

    	if($scope.formData.day6 == true)
    	{
				daysOff[day] = 6;
			}

    	$scope.formData.day = daysOff;

      Facility.addDaily(fid,description,capacity,name,$scope.formData)
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
