var app = angular.module('fasa7ny');

app.controller('cancelUserBookingController',function($scope, $http, $location, Offers) {

  $scope.booking = {
  "_id" : ("58f64a9e210df21352bb3b9f"),
  "booker" : ("58ed22fcbfe67363f0c3a41d"),
  "event_id" : ("58f39c7850010178595ccff0"),
  "booking_date" : ("2017-04-18T17:19:26.071Z"),
  "charge" : 30.9,
  "stripe_charge" : "ch_1A9zz7DEq0aAGUbxPYEGRYl6",
  "count" : 1,
  "__v" : 0
}
  $scope.stripe_charge = $scope.booking.stripe_charge;
  $scope.amount = $scope.booking.charge;


  $scope.refund= function()
  {
      $http.post('http://127.0.0.1:3000/bookings/refund', {charge_id: $scope.stripe_charge, amount: $scope.amount})
      .then(function successCallback(response){
          $http.post('http://127.0.0.1:3000/bookings/deleteRegUserBookings',{bookingD: $scope.booking._id})
              .then(function successCallback(response){
                              console.log(response.data);
                            }, function errorCallback(response){
                              console.log(response.data);
                       });
      }, function errorCallback(response){
          console.log(response.data);
      });
  }



});