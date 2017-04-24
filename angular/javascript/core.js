var app = angular.module('fasa7ny', ['ngRoute', 'ui.bootstrap', 'chart.js',
	'720kb.datepicker', 'ngCookies', 'sn.addthis']);

app.config(function ($routeProvider) {
	$routeProvider

	.when("/",{
		templateUrl : "views/landingpage.html",
		controller  : "navbarController"
	})

	.when("/profile", {							//NAVE
		templateUrl : "views/user_profile.html",
		controller  : "userController"
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




	.when("/book-event/:id", {
		templateUrl : "views/booking_event.html",
		controller  : "bookingEventController"
	})

	.when("/book_facility/:id", { //I want the facility name to be passed in the url
		templateUrl : "views/booking_facility.html",
		controller  : "bookFacilityController"
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

	.when("/createOneEvent/:businessId", {
		templateUrl : "views/createEvent.html",
		controller  : "onetimeController"
	})

	.when("/createOffer/:businessId", {
			templateUrl : "views/createOffer.html"
	})


	.when("/schedule/:name", {
		templateUrl : "views/calendar.html",
		controller  : "calendarController"

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
	.when("/user/notifications", {
		templateUrl : "views/notifications.html",
		controller  : "notificationsController"

	})
	.when("/editLocation", {
		templateUrl : "views/editLocation.html",
		controller  : "editLocationController"

	})
	.when("/error", {
		templateUrl : "views/error.html",
		controller  : "navbarController"

	})

	.when('/bookings/:eventoccId',{
		templateUrl: "views/occurrence_bookings.html",
		controller : "viewBookingsController"
	})

	.when('/bookings/:onceEventOcc',{
		templateUrl: "views/occurrence_bookings.html",
		controller : "viewEventBookings"
	})

	.when('/success/:bookingId',{
		templateUrl: "views/successful_booking.html",
		controller : "successfulBookingController"
	})


});



