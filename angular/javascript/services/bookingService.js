
var app = angular.module('fasa7ny');
app.factory('Offers', ['$http', function($http) {
        return {
            get : function(id) {
                return $http.get('http://127.0.0.1:3000/offers/viewOffers/'+id);
            },

            getPublishKey: function(){
                return $http.get('http://127.0.0.1:3000/auth/getStripePK');
            }

        }
    }]);

app.factory('Occurrences',['$http',function($http)
{
	return {
         	get : function() {
                return $http.get('http://127.0.0.1:3000/event/viewO');
            }
        }
}])
.factory('Facilities',['$http',function($http)
{
    return {
            get : function() {
                return $http.get('http://127.0.0.1:3000/event/facilities');
            },

            getEvent : function(event_id){
            return $http.get('http://127.0.0.1:3000/event/getEvent/'+event_id);
        }
        }
}]);

