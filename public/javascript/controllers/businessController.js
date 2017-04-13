angular.module('businessController', [])

    .controller('mainController', function($scope, $http, Business) {
        Business.get()
                .then(function(data) {
                        $scope.business = "data";
                        // console.log(data);
                })

    });