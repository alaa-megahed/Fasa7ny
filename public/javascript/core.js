// angular.module('homepage', ['homepageController', 'homepageService']);
// angular.module('business', ['businessController', 'businessService']);


var app = angular.module('fasa7ny',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider
	// .when("/",{
	// 	templateUrl : "./public/views/index.ejs",
	// 	controller  : "homepageController"
	// })

	.when("/", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})

	.when("/:id", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})
	.when("/business/edit", {
		templateUrl : "views/businessEdit.html",
		controller  : "businessController"

	})
	// $locationProvider.html5Mode(true);

});
