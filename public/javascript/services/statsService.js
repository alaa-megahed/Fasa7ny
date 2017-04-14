angular.module('statsService', [])
    .factory('Stats', function($http) {
        var factory = {}; 
        factory.postStats = function() {
            return $http.post('/business/stats'); 
        }
    }); 