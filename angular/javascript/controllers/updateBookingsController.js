var app = angular.module('fasa7ny');

app.controller('cancelUserBookingController',function($scope, $http, $location, Offers) {

  $scope.booking = {
  "_id" : "58f65103f6d41a349188ea09",
  "booker" : "58f0f48daa02d151aa4c987f",
  "event_id" : "58f3bff994d8e6442165260d",
  "booking_date" : "2017-04-18T17:46:43.170Z",
  "charge" : 103,
  "stripe_charge" : "ch_1AA0PWDEq0aAGUbxYrpDAZOE",
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