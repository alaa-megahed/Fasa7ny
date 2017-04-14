angular.module('bookingService', [])

.factory('Offers', function($http) {
        return {
            get : function() {
                return $http.get('/offers/viewOffers');
            }

        }
    });
