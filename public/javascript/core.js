app = angular.module('Main', ['ngRoute']);

app.config(function($routeProvider) {
  $routeProvider
  .when("/business", {
    templateUrl : "./public/views/businessPage.html",
    controller : "businessController"
  })
  .when("/edit", {
    templateUrl : "./public/views/editInformation.html",
    controller : "editInformation"
  })

})
