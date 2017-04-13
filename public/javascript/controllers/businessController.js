angular.module('businessController', [])

    .controller('main', function($scope, $http, Business) {
        Business.get()
                .then(function(d) {
                		console.log(d);
                        $scope.business = d.data;
                        $scope.phones = d.data.phones;
                        $scope.categories = d.data.category;
                });

        // Business.post()
        //         .then(function(d) {
        //         		console.log(d);
        //                 $scope.business = d.data;
        //                 $scope.phones = d.data.phones;
        //                 $scope.categories = d.data.category;
        //         });


    });