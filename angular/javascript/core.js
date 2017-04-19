//angular.module('homepage', ['ui.bootstrap','ngRoute','homepageController', 'homepageService']);
var app = angular.module('fasa7ny',['ngRoute', 'ui.bootstrap']);

app.config(function($routeProvider){
	$routeProvider
	.when("/",{
		templateUrl : "views/landingpage.html",
		controller  : "navbarController"
	})

	// .when("/", {
	// 	templateUrl : "views/businessPage.html",
	// 	controller  : "businessController"
	// })
	.when("/search/:id", {
		templateUrl : "views/searchtest.html",
		controller  : "searchtestController"

	})
	.when("/:id", {
		templateUrl : "views/businessPage.html",
		controller  : "businessController"
	})
	.when("/business/edit", {
		templateUrl : "views/businessEdit.html",
		controller  : "businessController"

	})
	.when("/auth/reset/:id", {
		templateUrl : "views/resetPassword.html",
		controller  : "resetPasswordController"

	})


	// $locationProvider.html5Mode(true);

});

app.config(['$httpProvider', function($httpProvider) {
  $httpProvider.defaults.withCredentials = true;
}]);
