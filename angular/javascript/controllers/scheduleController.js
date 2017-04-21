app.controller('scheduleController', function($scope, $http, Schedule, $location, $routeParams) {

console.log($routeParams.businessId);
$scope.error = "";
	Schedule.get($routeParams.businessId)
	.then(function successCallback(d) {
		console.log(d.data);
		$scope.events = d.data.events;
		$scope.eventocc = d.data.eventocc;

		$scope.events2 = [];
		var date = new Date();
		// console.log(date. getFullYear());
		$scope.now = date. getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
		for(var i = 0; i < $scope.events.length; i++) {
				for(var j = 0; j < $scope.eventocc.length; j++) {
					if($scope.events[i]._id == $scope.eventocc[j].event) {

						var startevent = new Date($scope.eventocc[j].day);
						var endevent = new Date($scope.eventocc[j].day);

						// startevent.setDate(startevent.getDate() - 1);
						// endevent.setDate(endevent.getDate() - 1);

						var time = $scope.eventocc[j].time;
						var a = time.split('-');
						var start = a[0];
						var end = a[1];

						var startsplit = start.split(':');
						var starthour = startsplit[0];
						var startmin = startsplit[1];

						startevent.setHours(Number(starthour));
						startevent.setMinutes(Number(startmin));

						var endsplit = end.split(':');
						var endhour = endsplit[0];
						var endmin = endsplit[1];

						endevent.setHours(Number(endhour));
						endevent.setMinutes(Number(endmin));
// <a ng-click="eventoptions()"> $scope.events[i]</a>
						$scope.events2.push({title:$scope.events[i].name, start:startevent, end:endevent});
						// $scope.events2.push({title:'<a href="/">' +  $scope.events[i] + '</a>', start:startevent, end:endevent})
					}
				}
			}
			console.log($scope.events2);
	}, function errorCallback(d) {
		eror = d.data;
	});


});
