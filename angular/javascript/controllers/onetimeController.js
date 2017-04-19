app.controller('onetimeController', function($scope, $http, $location, $routeParams, OneTimeEvent) {
console.log("habiiba one");
	$scope.businessId = $routeParams.businessId;
	console.log($scope.businessId);

	$scope.goToCreateEvent = function(){
		console.log("Create event 1");
		OneTimeEvent.create($scope.formData)
		.then(function(d){
			$location.path('/'+$scope.businessId);
		})
	};





});

