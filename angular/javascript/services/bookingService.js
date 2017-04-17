
var app = angular.module('fasa7ny');
app.factory('Offers', ['$http', function($http) {
        return {
            get : function(id) {
                return $http.get('http://127.0.0.1:3000/offers/viewOffers/'+id);
            },

        }
    }]);

app.factory('Occurrences',['$http',function($http)
{
	return {
         	get : function() {
                return $http.get('/event/viewO');
            }
        }
}]);

