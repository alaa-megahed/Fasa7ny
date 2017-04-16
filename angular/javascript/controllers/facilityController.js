app.controller('facilityController', function($scope, $http, $location, $routeParams) {
console.log("habiiba")
	$scope.businessId = $routeParams.businessId;
	console.log($scope.businessId);
});
