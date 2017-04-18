var app = angular.module('fasa7ny', ['ngRoute', 'ui.bootstrap', 'chart.js', 'sn.addthis']);

app.config(function ($routeProvider) {
    $routeProvider

        .when("/", {
            templateUrl: "views/businessPage.html",
            controller: "businessController"
        })

        .when("/:id", {
            templateUrl: "views/businessPage.html",
            controller: "businessController"
        })

        .when("/business/edit", {
            templateUrl: "views/businessEdit.html",
            controller: "businessController"

        })

        .when("/eventPage/:businessId/:eventId", {
            templateUrl: "views/eventPage.html",
            controller: "eventController"
        })

        .when("/createFacility/:businessId", {
            templateUrl: "views/createFacility.html",
            controller: "facilityController"
        })

        // $locationProvider.html5Mode(true);

        .when("/createOneEvent/:businessId", {
            templateUrl: "views/createEvent.html",
            controller: "onetimeController"
        })

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
