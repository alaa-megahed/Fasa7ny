// angular.module('homepage', ['homepageController', 'homepageService']);
// angular.module('business', ['businessController', 'businessService']);


var app = angular.module('fasa7ny',['ngRoute']);

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

	.when("/business/edit", {
		templateUrl : "views/businessEdit.html",
		controller  : "businessController"

	})

});
