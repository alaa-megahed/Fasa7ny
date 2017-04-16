app.controller('businessController', function($scope, $http, Business, $location, $routeParams) {
  $scope.maxRating = 5;
  $scope.ratedBy = 0;
  $scope.avgRate = 0;
console.log($routeParams.id);
$scope.id = "58e666a20d04c180d969d591";
        Business.get($scope.id)
                .then(function(d) {
                  console.log(d.data.result._id);
                        $scope.business = d.data.result;
                        $scope.phones = d.data.result.phones;
                        $scope.categories = d.data.result.category;
                        $scope.user = d.data.user;
                        if(d.data.rate) $scope.ratedBy = d.data.rate;
                        $scope.check = 0;
                        $scope.avgRate = d.data.result.average_rating;
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
         		console.log(d.data.business._id);
            $location.path('/'+ d.data.business._id);
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
             $scope.avgRate = d.data.average_rating;
           });
             $scope.ratedBy = star;
         };


         $scope.public = function(){
         	console.log('public ctrl');
         	Business.public()
         	.then(function(d){
         		console.log('public done');
         	})
        };

          $scope.remove = function(){
         	console.log('remove ctrl');
         	Business.remove()
         	.then(function(d){
         		console.log('remove done');
         	})
         }
    });
