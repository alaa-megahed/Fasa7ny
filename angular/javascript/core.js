
var app = angular.module('fasa7ny',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider

	.when("/",{
		templateUrl : "views/landingpage.html",
		controller  : "navbarController"
	})


	.when("/search/:id", {
		templateUrl : "views/searchtest.html",
		controller  : "searchtestController"
	})	

	.when("/book-event", {
		templateUrl : "views/booking_event.html",
		controller  : "bookingEventController"
	})
	
	.when("/book_facility/:id", { //I want the facility name to be passed in the url
		templateUrl : "views/booking_facility.html",
		controller  : "bookFacilityController"
	})

	.when("/business/:id", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})

	.when("/editBusiness", {
		templateUrl : "views/businessEdit.html",
		controller  : "businessController"
	})

	.when("/business/:name", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})


	.when("/:id", {
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


	.when("/createOffer/:businessId", {
			templateUrl : "views/createOffer.html"
	})

	.when("/schedule/:id", {
		templateUrl : "views/schedule.html",
		controller  : "scheduleController"
	})

	.when("/viewEvents/:facilityId", {
			templateUrl : "views/viewEvents.html",
			controller  : "dailyEventsController"
	})

	.when("/offers",{
		templateUrl : "views/offersView.html",
		controller  : "ViewOffersController"
	})


	.when("/viewOccurences/:eventId", {
			templateUrl : "views/viewOccurences.html",
			controller  : "viewOccurencesController"

	})
	.when("/auth/reset/:token", {
		templateUrl : "views/resetPassword.html",
		controller  : "resetPasswordController"

	})

	.when('/bookings/:eventoccId',{
		templateUrl: "views/occurrence_bookings.html",
		controller : "viewBookingsController"
	})

	.when('/success/:bookingId',{
		templateUrl: "views/successful_booking.html",
		controller : "successfulBookingController"
	})


	// $locationProvider.html5Mode(true);

});


app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}]);
