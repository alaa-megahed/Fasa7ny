app.controller('eventController', function($scope, $http, Event, $location, $routeParams) {

console.log("event eventController");
	Event.get($routeParams.businessId, $routeParams.eventId)
	.then(function(d) {
		$scope.businessId = d.data.businessId;
		$scope.event = d.data.event;
		$scope.eventocc = d.data.eventocc;
		//images
		console.log(d.data);
	});

});
