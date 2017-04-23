
var app = angular.module('fasa7ny',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider

	.when("/",{
		templateUrl : "views/landingpage.html",
		controller  : "navbarController"
	})

	// .when("/",{
	// 	templateUrl : "views/slider.html",
	// 	controller  : "CarouselDemoCtrl"
	// })

	.when("/search/:id", {
		templateUrl : "views/searchtest.html",
		controller  : "searchtestController"
	})

	.when("/editBusiness", {
		templateUrl : "views/businessEdit.html",
		controller  : "editBusinessController"
	})

	.when("/business/:name", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})

	.when("/eventPage/:eventId", {
		templateUrl : "views/eventPage.html",
		controller  : "eventController"
	})

	.when("/createFacility/:businessId", {
		templateUrl : "views/createFacility.html",
		controller  : "facilityController"
	})

	// $locationProvider.html5Mode(true);

	.when("/createOneEvent/:businessId", {
		templateUrl : "views/createEvent.html",
		controller  : "onetimeController"
	})

	.when("/schedule/:name", {
		templateUrl : "views/calendar.html",
		controller  : "calendarController"
	})

	.when("/viewEvents/:facilityId", {
			templateUrl : "views/viewEvents.html",
			controller  : "dailyEventsController"
	})

	.when("/viewOccurences/:eventId", {
			templateUrl : "views/viewOccurences.html",
			controller  : "viewOccurencesController"

	})
	.when("/auth/reset/:token", {
		templateUrl : "views/resetPassword.html",
		controller  : "resetPasswordController"

	})


	// $locationProvider.html5Mode(true);

});


app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}]);
