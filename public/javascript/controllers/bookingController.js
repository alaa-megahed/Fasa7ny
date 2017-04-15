angular.module('bookingController', [])

    .controller('main', function($scope, $http, Offers) {
        Offers.get()
        			.then(function(response) {
                       $scope.offers = response.data;
                       $scope.betengan = "Roody";
                   });

        $scope.book = function()
        {		
        	console.log($scope.count+" "+$scope.chosen_offer); //why undefined undefined?
        	$http.post('/bookings/regusers',{count: $scope.count,offer_id:$scope.chosen_offer}).then(function(data)
        	{
        		console.log(data);
        	});
        }
                        
     });


