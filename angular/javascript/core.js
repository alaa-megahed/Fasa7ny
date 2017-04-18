var app = angular.module('fasa7ny', ['ngRoute', 'ngFileUpload', 'chart.js', '720kb.socialshare']);

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
        .when('/upload', {
            templateUrl: 'views/upload.html',
            controller: 'UploadController'
        })
        .when('/statistics', {
            templateUrl: 'views/statistics.html',
            controller: 'StatsController'
        })

});


