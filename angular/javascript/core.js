var app = angular.module('fasa7ny', ['ngRoute']);

app.config(function ($routeProvider) {
    $routeProvider
        .when('/view-all', {
            templateUrl: 'views/search.html',
            controller: 'SearchController'
        })
        .when('/business/:name', {
            templateUrl: 'views/test.html',
            controller: 'BusinessController'
        })

});


