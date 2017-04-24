// angular.module('homepage', ['homepageController', 'homepageService']);
// angular.module('business', ['businessController', 'businessService']);


var app = angular.module('fasa7ny',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider
	// .when("/",{
	// 	templateUrl : "./public/views/index.ejs",
	// 	controller  : "homepageController"
	// })

	//webAdminProfile
	.when("/webAdminProfile", {
		templateUrl : "views/web_admin.html",
		controller  : "webAdminController"
	})



	// .when("/", {
	// 	templateUrl : "views/bookings.html",
	// 	controller  : "bookingController"
	// })

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



});
