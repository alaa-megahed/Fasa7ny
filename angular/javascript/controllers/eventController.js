app.controller('eventController', function($scope, $http, Event, $location, $routeParams, $modal) {

console.log("event eventController");
	Event.get($routeParams.businessId, $routeParams.eventId)
	.then(function(d) {
		$scope.businessId = d.data.businessId;
		$scope.event = d.data.event;
		$scope.eventocc = d.data.eventocc;
		//images
		console.log(d.data);
	});

	// $scope.DeleteEvent = function(id,bid){
	// 	console.log('delete event ctrl');
	// 	Event.delete(id)
	// 	.then(function(d){
	// 		$location.path('/'+bid);
	// 	})
	// };

	$scope.showDelete = function (id,bid) {
        $scope.message = "Show Delete Button Clicked";
        console.log($scope.message);
        console.log("Delete");
        var modalInstance = $modal.open({
            templateUrl: 'views/deletePopUp.html',
            controller: DeletePopUp,
            scope: $scope,
            resolve: {
                    bid: function () {
                        return bid;
                    },
                    id: function(){
                    	return id;
                    }
                }
       
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            });
    };


    $scope.showForm = function (id) {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);
        console.log("1"+$scope.formData);
        var modalInstance = $modal.open({
            templateUrl: 'views/editEvent.html',
            controller: ModalInstanceCtrl,
            scope: $scope,
            resolve: {
                    id: function () {
                        return id;
                    }
                }
       
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            });
    }
            
});
var DeletePopUp = function ($scope, $modalInstance,Event,id,bid,$route) {
    $scope.form = {}
    $scope.submitForm = function () {
    	console.log('Delete Form');
        Event.delete(id,bid)
        .then(function(d){
        	console.log('del');
        });
        $route.reload();
        $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};



var ModalInstanceCtrl = function ($scope, $modalInstance,Event,id,$route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.submitForm = function () {
    	console.log('Submit Form'+$scope.formData);
        Event.edit($scope.formData,id)
        .then(function(d){
        	console.log('yas');
        });
        $route.reload();
        $modalInstance.close('closed');
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};

	


