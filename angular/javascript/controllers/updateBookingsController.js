var app = angular.module('fasa7ny');

app.controller('editUserBookingController',function($scope, $http, $location, Offers) {

	//encapsulate in refund
	$http.post('http://127.0.0.1:3000/bookings/editRegUserBookings/',{bookingE: $scope.booking_id,count:$scope.new_count})
			.then(function successCallback(response){
                      console.log(response.data);
                    }, function errorCallback(response){
                      console.log(response.data);
               });
});

app.controller('cancelUserBookingController',function($scope, $http, $location, Offers) {

	//encapsulate in refund
	$http.post('http://127.0.0.1:3000/bookings/regUserDeleteBookings/',{bookingD: $scope.booking_id})
			.then(function successCallback(response){
                      console.log(response.data);
                    }, function errorCallback(response){
                      console.log(response.data);
               });
});