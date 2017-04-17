app.controller('facilityController', function($scope, $http, Facility, $location, $routeParams, $modal, $log) {

	$scope.goToCreate = function() {
		Facility.createFacility($scope.formData)
		.then(function(d) {
			console.log("create facility success");
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
