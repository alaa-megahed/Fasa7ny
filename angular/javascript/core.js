var app = angular.module('fasa7ny', ['ngRoute', 'ui.bootstrap', 'chart.js',
	'720kb.datepicker', 'ngCookies', 'sn.addthis']);

app.config(function ($routeProvider) {
	$routeProvider

		.when("/", {
			templateUrl: "views/landingpage.html",
			controller: "navbarController"
		})

		.when('/view-all', {
			templateUrl: 'views/search.html',
			controller: 'SearchController'
		})
		.when('/statistics/:id', {
			templateUrl: 'views/statistics.html',
			controller: 'StatsController'
		})

		.when("/search/:keyword", {
			templateUrl: "views/search.html",
			controller: "SearchController"
		})

		.when("/editBusiness", {
			templateUrl: "views/businessEdit.html",
			controller: "editBusinessController"
		})

		.when("/business/:name", {
			templateUrl: "views/businessPage.html",
			controller: "businessController"
		})

		.when("/eventPage/:eventId", {
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

		.when("/schedule/:name", {
			templateUrl: "views/calendar.html",
			controller: "calendarController"
		})

		.when("/viewEvents/:facilityId", {
			templateUrl: "views/viewEvents.html",
			controller: "dailyEventsController"
		})

		.when("/viewOccurences/:eventId", {
			templateUrl: "views/viewOccurences.html",
			controller: "viewOccurencesController"

		})
		.when("/auth/reset/:token", {
			templateUrl: "views/resetPassword.html",
			controller: "resetPasswordController"

		})
		.when('/error', {
			
		})


});



