// angular.module('homepage', ['homepageController', 'homepageService']);
// angular.module('business', ['businessController', 'businessService']);


var app = angular.module('fasa7ny',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider

	// .when("/", {
	// 	templateUrl : "views/businessPage.html",
	// 	controller  : "businessController"
	// })

	.when("/book-event", {
		templateUrl : "views/booking_event.html",
		controller  : "bookingEventController"
	})
	
	.when("/book_facility", { //I want the facility name to be passed in the url
		templateUrl : "views/booking_facility.html",
		controller  : "bookFacilityController"
	})

	.when("/:id", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})

	.when("/business/edit", {
		templateUrl : "views/businessEdit.html",
		controller  : "businessController"

	})

	.when("/eventPage/:businessId/:eventId", {
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

	.when("/schedule/:id", {
		templateUrl : "views/schedule.html",
		controller  : "scheduleController"
	})
//webAdminProfile
	.when("/", {
		templateUrl : "views/webAdmin.html",
		controller  : "webAdminController"
	})


});	



