var app = angular.module('fasa7ny');

app.controller('viewBookingsController',function($scope,$routeParams,status,$http,$location,occurrenceBookings)
{


   status.local().then(function(res){
   if(res.data)
   {
     if(res.data.user_type == 1) $scope.type = 1;
     else if(res.data.user_type == 2) $scope.type  = 4;
     else $scope.type = 3;
   }
   else {
     status.foreign().then(function(res){
       if(res.data.user_type) $scope.type = 1;
       else $scope.type = 2;
     });
   }
 });


  $scope.eventocc = $routeParams.eventoccId;
  $scope.error_message = "";
  occurrenceBookings.get($scope.eventocc).then(function (response)
  {
      $scope.bookings = response.data;
          
  });
  $scope.error_message

  $scope.deleteBooking = function(bookingID,eventoccId)
  {
    $http.post('bookings/cancel_booking',{booking_id:bookingID,event_id:eventoccId}).then(
      function success(response)
      {
        occurrenceBookings.get($scope.eventocc).then(function (response){
            $scope.bookings = response.data;
      },
      function error(response)
      {
          $scope.error = response.data;
      });
    });
  }
        
});

 
      