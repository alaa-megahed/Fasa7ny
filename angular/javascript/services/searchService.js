angular.module('fasa7ny')
    .factory('Search', function ($http) {
        var factory = {};
        factory.get = function () {
            return $http.get('http://localhost:3000/search'); 
                
        }

        return factory;
    }); 