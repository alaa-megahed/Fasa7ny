// angular.module('businessController', [])

app.controller('businessController', function($scope, $http, Business, $location) {
  $scope.maxRating = 5;
  $scope.ratedBy = 0;
        Business.get()
                .then(function(d) {
                  console.log(d.data.result._id);
                        $scope.business = d.data.result;
                        $scope.phones = d.data.result.phones;
                        $scope.categories = d.data.result.category;
                        $scope.user = d.data.user;
                        if(d.data.rate) $scope.ratedBy = d.data.rate;
                        $scope.check = 0;

                        for(var i = 0; i < d.data.result.subscribers.length; i++) {
                          if(d.data.result.subscribers[i] == d.data.user)
                            $scope.check = 1;
                        }
                      console.log($scope.check);
                });




         $scope.goToEdit = function() {
         	console.log("controller");
         	Business.edit($scope.formData)
         	.then(function(d) {
         		console.log("edit done");
         	})
         };

         $scope.subscribe = function(id) {
         	console.log("controller subscribe");
         	Business.subscribe(id)
         	.then(function(d) {
         		console.log("sub done");
         	})
        };

         $scope.unsubscribe = function(id) {
           console.log("controller unsubscribe");
           Business.unsubscribe(id)
           .then(function(d) {
             console.log("unsub done");
           })
         };

         $scope.rateBy = function (star) {
           console.log("rating ctrl");
           Business.rate(star)
           .then(function(d) {
             console.log("rating done");
           });
             $scope.ratedBy = star;
         }

        //  $scope.rate = function(rate, id) {
        //    console.log("controller rate");
        //    Business.rate(rate, id)
        //    .then(function(d) {
        //      console.log("rate done");
        //    })
        //  }
    });
