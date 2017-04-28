app.factory('dailyEvents', ['$http', 'IP', function($http, IP) {
  return {
    get : function(facilityId) {
      console.log(facilityId);
      return $http.get('http://'+ IP.address + ':3000/event/getEvents/' + facilityId);
    },

    delete : function(eventId){
      console.log("delete service");
      return $http.get('http://'+ IP.address + ':3000/event/cancel/'+ eventId);

    },

     edit : function(formData,eventId){
          console.log("edit service"+formData);
          return $http.post('http://'+ IP.address + ':3000/event/edit/'+eventId, formData);
        }
  }
}]);
