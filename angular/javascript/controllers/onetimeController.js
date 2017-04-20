app.controller('onetimeController', function($scope, $http, $location, $routeParams, OneTimeEvent) {
console.log("habiiba one");
	$scope.businessId = $routeParams.businessId;
	console.log($scope.businessId);

	$scope.goToCreateEvent = function(){
		$scope.error = "";
		console.log("Create event 1");
		OneTimeEvent.create($scope.formData)
		.then(function successCallback(d) {
			console.log("create facility success");
			$location.path('/'+$scope.businessId);
		},
		function errorCallback(d){
			$scope.error = d.data;
		})
	};





});

