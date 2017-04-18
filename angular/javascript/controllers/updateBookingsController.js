var app = angular.module('fasa7ny');

app.controller('cancelUserBookingController',function($scope, $http, $location, Offers) {

  $scope.booking;
  $scope.stripe_charge = $scope.booking.stripe_charge;
  $scope.amount = $scope.booking.charge;
  $http.post('http://127.0.0.1:3000/bookings/refund', {charge_id: $scope.stripe_charge, amount: $scope.amount})
      .then(function successCallback(responce){
          $http.post('http://127.0.0.1:3000/bookings/regUserDeleteBookings/',{bookingD: $scope.booking_id})
              .then(function successCallback(response){
                              console.log(response.data);
                            }, function errorCallback(response){
                              console.log(response.data);
                       });
      }, function errorCallback(responce){
          console.log(response.data);
      });

});