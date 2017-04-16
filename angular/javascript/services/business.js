angular.module('businessService', [])

    .factory('Business', function($http) {
        return {
            get : function() {
                return $http.get('/business/b');
            }

            // post : function(){
            // 	retur $http.post('/business/editInformation');
            // }
        }
    });