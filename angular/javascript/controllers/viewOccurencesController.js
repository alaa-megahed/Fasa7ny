app.controller('viewOccurencesController', function($scope, $http, viewOccurences, $location, $routeParams, $modal) {
  console.log("view occ controller");
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
    $scope.submitForm = function () {
    	console.log('Delete Occ Form');
        viewOccurences.delete(occId)
        .then(function(d){
        	console.log('del occ');
        });
        $route.reload();
        $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
