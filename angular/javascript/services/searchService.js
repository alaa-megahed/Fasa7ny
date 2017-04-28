angular.module('fasa7ny')
    .factory('Search', function ($http) {
        var factory = {};
        factory.get = function () {
            return $http.get('http://54.187.92.64:3000/search');

        }

        return factory;
    });
