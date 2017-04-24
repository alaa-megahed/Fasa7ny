'use strict';

/* App Module */

app.controller('calendarController', function($scope, Schedule, $routeParams) {
$scope.error = "";
console.log("gi");
  Schedule.get($routeParams.name)
  .then(function successCallback(d) {
    console.log(d.data);
    $scope.events1 = d.data.events;
    $scope.eventocc = d.data.eventocc;

    $scope.events = [];
    var date = new Date();
    // console.log(date. getFullYear());
    $scope.now = date. getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    for(var i = 0; i < $scope.events1.length; i++) {
        for(var j = 0; j < $scope.eventocc.length; j++) {
          if($scope.events1[i]._id == $scope.eventocc[j].event) {

            var startevent = new Date($scope.eventocc[j].day);
            var endevent = new Date($scope.eventocc[j].day);

            // startevent.setDate(startevent.getDate() - 1);
            // endevent.setDate(endevent.getDate() - 1);

            var time = $scope.eventocc[j].time;
            var a = time.split('-');
            var start = a[0];
            var end = a[1];

            var startsplit = start.split(':');
            var starthour = startsplit[0];
            var startmin = startsplit[1];

            startevent.setHours(Number(starthour));
            startevent.setMinutes(Number(startmin));

            var endsplit = end.split(':');
            var endhour = endsplit[0];
            var endmin = endsplit[1];

            endevent.setHours(Number(endhour));
            endevent.setMinutes(Number(endmin));
// <a ng-click="eventoptions()"> $scope.events[i]</a>
            $scope.events.push({text:$scope.events1[i].name, start_date:startevent, end_date:endevent});
            // $scope.events2.push({title:'<a href="/">' +  $scope.events[i] + '</a>', start:startevent, end:endevent})
          }
        }
      }
      console.log($scope.events);
      $scope.scheduler = { date : new Date() };
  }, function errorCallback(d) {
      $scope.error = d.data;
  });


console.log("??");
  // $scope.events = $scope.events2;
  // $scope.events = [
  //   { id:1, text:"Task A-12458",
  //     start_date: new Date(2013, 10, 12),
  //     end_date: new Date(2013, 10, 16) },
  //   { id:2, text:"Task A-83473",
  //     start_date: new Date(2013, 10, 22 ),
  //     end_date: new Date(2013, 10, 24 ) }
  // ];
// console.log($scope.events);

});
