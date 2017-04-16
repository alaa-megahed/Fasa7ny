var app = angular.module('fasa7ny',['ngRoute']); 

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/index.html', 
            // controller: 'SearchController'
        })
        .when('/view-all', {
            templateUrl: 'views/search.html', 
            controller: 'SearchController'
        })
})

