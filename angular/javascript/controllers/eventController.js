app.controller('eventController', function($scope, $http, Event, $location, $routeParams, $modal,$window) {

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
            controller: DeletePopUp2,
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
            $window.location.reload();
            });
    }

});
var DeletePopUp2 = function ($scope, $modalInstance,Event,id,bid,$route,$window) {
    $scope.form = {}
    $scope.submitForm = function () {
    	console.log('Delete Form');
        Event.delete(id,bid)
        .then(function(d){
        

        });
            console.log('del');
            $modalInstance.close('closed');
            $window.location =" http://localhost:8000/#!/";
       

    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};



var ModalInstanceCtrl = function ($scope, $modalInstance,Event,id,$route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.error = "";
    $scope.submitForm = function () {
         if(($scope.formData.starttime && !$scope.formData.endtime) || (!$scope.formData.starttime && $scope.formData.endtime)){
            $scope.error = "Must enter both a start date and end date";
        }
        else {
        	console.log('Submit Form'+$scope.formData);
            Event.edit($scope.formData,id)
            .then(function successCallback(d){
            	console.log('yas');
                 $route.reload();
                $modalInstance.close('closed');
            }, function errorCallback(d) {
                $scope.error = d.data;
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
};
