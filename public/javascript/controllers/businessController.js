angular.module('businessController', [])

    .controller('main', function($scope, $http, Business) {
        Business.get()
                .then(function(d) {
                		console.log(d);
                        $scope.message = d.data;
                });

    });