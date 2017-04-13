angular.module('businessService', [])

    .factory('Business', function($http) {
        return {
            get : function() {
                console.log("haiaia");
                return $http.get('/business/b');
            }
        }
    });