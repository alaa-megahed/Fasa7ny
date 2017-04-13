angular.module('businessService', [])

    .factory('Business', function($http) {
        return {
            get : function() {
                return $http.get('/business/b');
            }
        }
    });