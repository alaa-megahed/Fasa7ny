angular.module('homepageController', [])

  .controller('main' , function($scope, $http, Homepage) {

    Homepage.get()
           .then(function(data) {
               $scope.message = "Ahlann";
           });

  })
