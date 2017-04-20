app.factory('Event', ['$http', function($http) {
    return {
        get : function(businessId, eventId) {
          console.log(businessId);
          console.log(eventId);
          console.log("!!");
            return $http.get('http://127.0.0.1:3000/event/getOnceEventDetails/' + businessId + '/' + eventId);
        },

        delete : function(id){
        	console.log("delete service");
        	return $http.get('http://127.0.0.1:3000/event/cancel/'+ id);

        },

        edit : function(formData,id){
        	console.log("edit service"+formData);

          if(formData.starttime && formData.endtime)
            formData.timing = formData.starttime.getHours()+":"+formData.starttime.getMinutes()+"-"+formData.endtime.getHours()+":"+formData.endtime.getMinutes();

        	return $http.post('http://127.0.0.1:3000/event/edit/'+id, formData);
        }
  }
}]);
