app.controller('onetimeController', function($scope, $http, status, $location, $routeParams, OneTimeEvent) {
console.log("one time");
	$scope.user = {};
		status.local()
		 .then(function(res){
		   if(res.data){
				 $scope.user = res.data;
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

	$scope.businessId = $routeParams.businessId;
	console.log($scope.businessId);

	$scope.goToCreateEvent = function(){
		$scope.error = "";
		console.log("Create event 1");
		OneTimeEvent.create($scope.formData)
		.then(function successCallback(d) {
			console.log($scope.user.name);
			$location.path('/business/'+$scope.user.name);
		},
		function errorCallback(d){
			$scope.error = d.data;
		})
	};





});
