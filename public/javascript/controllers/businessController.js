// angular.module('businessController', [])

app.controller('businessController', function($scope, $http, Business, $location) {
        Business.get()
                .then(function(d) {
                  console.log(d.data.result._id);
                        $scope.business = d.data.result;
                        $scope.phones = d.data.result.phones;
                        $scope.methods = d.data.result.payment_methods;
                        $scope.categories = d.data.result.category;
                        $scope.user = d.data.user;
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
         },

         $scope.rate = function(rate, id) {
           console.log("controller rate");
           Business.rate(rate, id)
           .then(function(d) {
             console.log("rate done");
           })
         },

         $scope.public = function(){
         	console.log('public ctrl');
         	Business.public()
         	.then(function(d){
         		console.log('public done');
         	})
         },

          $scope.remove = function(){
         	console.log('remove ctrl');
         	Business.remove()
         	.then(function(d){
         		console.log('remove done');
         	})
         }

        // $scope.edit() = function() {
        // 	$http.get('/business/edit');
        // }

        // Edit.get()
        //         .then(function(d) {
        //         		console.log(d);
        //                 $scope.business = d.data;
        //                 $scope.phones = d.data.phones;
        //                 $scope.categories = d.data.category;
        //         });


    });
