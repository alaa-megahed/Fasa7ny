// angular.module('businessController', [])

app.controller('businessController', function($scope, $http, Business, $location) {
        Business.get()
                .then(function(d) {
                		console.log(d);
                        $scope.business = d.data;
                        $scope.phones = d.data.phones;
                        $scope.categories = d.data.category;
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