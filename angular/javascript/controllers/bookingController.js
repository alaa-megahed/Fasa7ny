
angular.module('fasa7ny')
.controller('bookingController', function($scope, $http, $location, Offers) {
        Offers.get()
                .then(function(response) {
                       $scope.offers = response.data;
                       $scope.betengan = "Roody";
                   });

        $scope.book = function()
        {		
        	console.log("count   "+$scope.formData.count+" offer   "+$scope.formData.chosen_offer); //why  undefined?
        	$http.post('/bookings/regusers',{count: $scope.formData.count,offer_id:$scope.formData.chosen_offer}).then(function(data)
        	{
        		console.log(data);
        	});
        }
                        
     })

.controller('bookFacilityController', function($scope, $http, $location, Offers,Occurrences,Facilities) {
      
      Offers.get().then(function(response) {
              $scope.offers = response.data;
              $scope.betengan = "Facility Booking";
        });
      Facilities.get().then(function(response){
           $scope.facilities = response.data;
           console.log("facilities response :"+response);
      });
      Occurrences.get().then(function(response){
           $scope.timings = response.data;
      });

      $scope.choose_facility = function(facility_id)
      {
        $scope.facility = facility_id;
      }
      $scope.choose_date = function(date)
      {
        $scope.date  = date.getDate();
        $scope.year  = date.getFullYear();
        $scope.month = date.getMonth();
      }
      $scope.Date = function(datetime)
      {
        return new Date(datetime).getDate();
      }
      $scope.Year = function(datetime)
      {
        return new Date(datetime).getFullYear();
      }
      $scope.Month = function(datetime)
      {
        return new Date(datetime).getMonth();
      }
      $scope.choose_occ = function(timing)
      {
        $scope.max_count = timing.available;
        console.log(timing.available);
      }

      $scope.minDate = new Date();
      var today = new Date();
      today.setMonth(today.getMonth()+1);
      $scope.maxDate = new Date(today.getFullYear(),today.getMonth() , today.getDate());

      $scope.book = function()
      {
          $http.post('/bookings/regusers',{count: $scope.formData.count,offer_id:$scope.formData.chosen_offer,
                                            event:$scope.formData.chosen_time.id}).then(function(data)
          {
            console.log(data);
          });
      }

      
       
});


