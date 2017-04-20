app.controller('dailyEventsController', function($scope, $http, dailyEvents, $location, $routeParams, $modal) {

console.log("dailyevent eventController");
console.log($routeParams.facilityId);
	dailyEvents.get($routeParams.facilityId)
	.then(function(d) {
    $scope.events = d.data.events;
		$scope.eventslength = d.data.events.length;
    $scope.eventocc = d.data.eventocc;
		$scope.name = d.data.name;
		console.log(d.data.name);
    $scope.name1 = $scope.name.substring(0, $scope.name.length/2);
    $scope.name2 = $scope.name.substring($scope.name.length/2);

    for(var i = 0; i < $scope.events.length; i++)
      for(var j = 0; j < $scope.eventocc.length; j++)
        if($scope.events[i]._id == $scope.eventocc[j].event)
        {
          $scope.events[i].time = $scope.eventocc[j].time;
          break;
        }

    for(var x = 0; x < $scope.events.length; x++) {
      var days = "";
      // console.log("daysoff: " + $scope.events[x]);
      for(var y = 0; $scope.events[x].daysOff && y < $scope.events[x].daysOff.length ; y++){
        if($scope.events[x].daysOff[y]==0){ days = days + "Sunday, ";}
        else if($scope.events[x].daysOff[y]==1){ days = days + "Monday, ";}
        else if($scope.events[x].daysOff[y]==2){ days = days + "Tuesday, ";}
        else if($scope.events[x].daysOff[y]==3){ days = days + "Wednesday, ";}
        else if($scope.events[x].daysOff[y]==4){ days = days + "Thursday, ";}
        else if($scope.events[x].daysOff[y]==5){ days = days + "Friday, ";}
        else if($scope.events[x].daysOff[y]==6){ days = days + "Saturday, ";}
      }
			if($scope.events[x].daysOff.length == 0){
				days = "No days off";
				$scope.events[x].days = days
			}
			else{
      $scope.events[x].days = days.substring(0, days.length-2);
		}
    }

    console.log($scope.events);

	});

  	$scope.deleteEvent = function (eventId) {
          $scope.message = "Show Daily Delete Button Clicked";
          console.log($scope.message);
          console.log("Delete");
					console.log(eventId);
          var modalInstance = $modal.open({
              templateUrl: 'views/deleteDailyPopUp.html',
              controller: DeletePopUp1,
              scope: $scope,
              resolve: {
                      eventId: function() {
                      	return eventId;
                      }
                  }
          });
          modalInstance.result.then(function (selectedItem) {
              $scope.selected = selectedItem;
              });
      };

      $scope.editDailyEvent = function (eventId) {
        $scope.message = "Show Form Button Clicked";
        console.log($scope.message);
        // console.log("1"+$scope.formData);
        var modalInstance = $modal.open({
            templateUrl: 'views/editDailyEvent.html',
            controller: editDailyEvent,
            scope: $scope,
            resolve: {
                    eventId: function () {
                        return eventId;
                    }
                }

        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
            });
    };

		$scope.viewOccurences = function(eventId) {
			console.log("view occurences daily event controller");
			$location.path('/viewOccurences/' + eventId);

		}


});

var DeletePopUp1 = function ($scope, $modalInstance,dailyEvents,eventId,$route) {
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


var editDailyEvent = function ($scope, $modalInstance,dailyEvents,eventId,$route) {
    $scope.form = {}
    $scope.formData = {}
    $scope.submitForm = function () {
      console.log('Submit Form'+$scope.formData);

      var daysOff = [];
      var day = 0;
      if($scope.formData.day0 == true)
      {
        daysOff[day] = 0;
        day++;
      }

      if($scope.formData.day1 == true)
      {
        daysOff[day] = 1;
        day++;
      }

      if($scope.formData.day2 == true)
      {
        daysOff[day] = 2;
        day++;
      }

      if($scope.formData.day3 == true)
      {
        daysOff[day] = 3;
        day++;
      }

      if($scope.formData.day4 == true)
      {
        daysOff[day] = 4;
        day++;
      }

      if($scope.formData.day5 == true)
      {
        daysOff[day] = 5;
        day++;
      }

      if($scope.formData.day6 == true)
      {
        daysOff[day] = 6;
      }

      $scope.formData.day = daysOff;
        dailyEvents.edit($scope.formData,eventId)
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