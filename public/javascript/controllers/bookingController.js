angular.module('bookingController', [])

    .controller('main', function($scope, $http, Offers) {
        Offers.get()
        			.then(function(response) {
                       $scope.offers = response.data;
                       $scope.betengan = "Roody";

        $scope.book = function(offer_id)
        {
        	// $http.post()
        }
                        
     });



});