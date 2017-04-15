angular.module('bookingController', [])

    .controller('main', function($scope, $http, Offers) {
        Offers.get().then(function(response) {
                       $scope.offers = response.data;
                       $scope.betengan = "Roody";
                   });

        $scope.book = function()
        {		
        	console.log($scope.formData.count+" "+$scope.formData.chosen_offer); //why  undefined?
        	$http.post('/bookings/regusers',{count: $scope.formData.count,offer_id:$scope.formData.chosen_offer}).then(function(data)
        	{
        		console.log(data);
        	});
        }
                        
     });


