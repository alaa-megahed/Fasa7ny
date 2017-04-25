angular.module('fasa7ny')
    .factory('Search', function ($http) {
        var factory = {};
        factory.get = function () {
            return $http.get('http://127.0.0.1:3000/search');
                
        }

        return factory;
    }); 