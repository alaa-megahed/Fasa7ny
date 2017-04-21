app.controller('viewOccurencesController', function($scope, $http, status,viewOccurences, $location, $routeParams, $modal) {
  console.log("view occ controller");

   status.local()
 .then(function(res){
   if(res.data){
     if(res.data.user_type == 1)
       $scope.type = 1;
     else if(res.data.user_type == 2)
       $scope.type  = 4;
     else $scope.type = 3;
   }
   else {
     status.foreign()
     .then(function(res){
       if(res.data.user_type)
         $scope.type = 1;
       else $scope.type = 2;
     });
   }
 });


  viewOccurences.get($routeParams.eventId)
	.then(function(d) {
    $scope.eventocc = d.data.eventocc;
    $scope.time = d.data.eventocc[0].time;
    console.log($scope.eventocc);
  });

  $scope.deleteEvent = function (occId) {
        $scope.message = "Show Occ Delete Button Clicked";
        console.log($scope.message);
        console.log("Delete occ");
        var modalInstance = $modal.open({
            templateUrl: 'views/deleteOccPopUp.html',
            controller: DeletePopUp,
            scope: $scope,
            resolve: {

                    occId: function(){
                      return occId;
                    }
                }

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            });
    };
});

var DeletePopUp = function ($scope, $modalInstance,viewOccurences,occId,$route) {
    $scope.form = {}
    $scope.error ="";
    $scope.submitForm = function () {
    	console.log('Delete Occ Form');
        viewOccurences.delete(occId)
        .then(function successCallback(d){
        	console.log('del occ');
            $route.reload();
        $modalInstance.close('closed');
        },
        function errorCallback(d){
            $scope.error = d.data;
        });
        
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
