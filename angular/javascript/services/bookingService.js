
angular.module('fasa7ny')
.factory('Offers', ['$http', function($http) {
        return {
            get : function() {
                return $http.get('http://127.0.0.1:3000/offers/viewOffers');
            }

        }
    }])
.factory('Occurrences',['$http',function($http)
{
	return {
         	get : function() {
                return $http.get('/event/viewO');
            }
        }
}]);

