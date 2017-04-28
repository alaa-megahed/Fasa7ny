var app = angular.module('fasa7ny');

app.controller('cancelUserBookingController',function($scope, $http, $location, Offers, IP) {

  $scope.booking = {
  "_id" : ("58f6430d210df21352bb3b9b"),
  "booker" : ("58ed22fcbfe67363f0c3a41d"),
  "event_id" : ("58f39c7850010178595ccff0"),
  "booking_date" : ("2017-04-18T16:47:09.719Z"),
  "charge" : 30.9,
  "stripe_charge" : "ch_1A9zTtDEq0aAGUbxnbk0hTK6",
  "count" : 1,
  "__v" : 0
}

  $scope.stripe_charge = $scope.booking.stripe_charge;
  $scope.amount = $scope.booking.charge;


  $scope.refund = function()
  {
      $http.post('http://'+ IP.address + ':3000/bookings/refund', {charge_id: $scope.stripe_charge, amount: $scope.amount})
      .then(function successCallback(response){
          $http.post('http://'+ IP.address + ':3000/bookings/deleteRegUserBookings',{bookingD: $scope.booking._id})
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