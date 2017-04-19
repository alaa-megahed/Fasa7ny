app.controller('dailyEventsController', function($scope, $http, dailyEvents, $location, $routeParams, $modal) {

console.log("dailyevent eventController");
console.log($routeParams.facilityId);
	dailyEvents.get($routeParams.facilityId)
	.then(function(d) {
    $scope.events = d.data.events;
    $scope.eventocc = d.data.eventocc;
    $scope.name1 = $scope.events[0].name.substring(0, $scope.events[0].name.length/2 + 1);
    $scope.name2 = $scope.events[0].name.substring($scope.events[0].name.length/2 + 1);

    for(var i = 0; i < $scope.events.length; i++)
      for(var j = 0; j < $scope.eventocc.length; j++)
        if($scope.events[i]._id == $scope.eventocc[j].event)
        {
          $scope.events[i].time = $scope.eventocc[j].time;
          break;
        }

    for(var x = 0; x < $scope.events.length; x++) {
      var days = "";
      var d = 0;
      // console.log("daysoff: " + $scope.events[x]);
      for(var y = 0; $scope.events[x].daysOff && y < $scope.events[x].daysOff.length ; y++){
        if($scope.events[x].daysOff[y]==0){ days = days + "Sunday, "; d++; }
        else if($scope.events[x].daysOff[y]==1){ days = days + "Monday, "; d++; }
        else if($scope.events[x].daysOff[y]==2){ days = days + "Tuesday, "; d++; }
        else if($scope.events[x].daysOff[y]==3){ days = days + "Wednesday, "; d++; }
        else if($scope.events[x].daysOff[y]==4){ days = days + "Thursday, "; d++; }
        else if($scope.events[x].daysOff[y]==5){ days = days + "Friday, "; d++; }
        else if($scope.events[x].daysOff[y]==6){ days = days + "Saturday, "; d++; }
      }
      $scope.events[x].days = days.substring(0, days.length-2);
    }

    console.log($scope.events);

	});

  	$scope.deleteEvent = function (eventId) {
          $scope.message = "Show Daily Delete Button Clicked";
          console.log($scope.message);
          console.log("Delete");
          var modalInstance = $modal.open({
              templateUrl: 'views/deleteDailyPopUp.html',
              controller: DeletePopUp,
              scope: $scope,
              resolve: {

                      eventId: function(){
                      	return eventId;
                      }
                  }

          });

          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
              });
      };


});

var DeletePopUp = function ($scope, $modalInstance,dailyEvents,eventId,$route) {
    $scope.form = {}
    $scope.submitForm = function () {
    	console.log('Delete Daily Form');
        dailyEvents.delete(eventId)
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
