angular.module('businessController', [])

    .controller('main', function($scope, $http, Business, Subscribe) {
        Business.get()
                .then(function(d) {
                		console.log(d);
                    $scope.message = d.data;
                });

        $scope.subscribe = function(id) {
          Subscribe.get(id)
                .then(function() {
                  console.log("hohohoho");
                })
        }
    });
