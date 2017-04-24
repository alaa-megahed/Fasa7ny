app.factory('Event', ['$http', function($http) {
    return {
        get : function(eventId) {
          console.log(eventId);
          console.log("!!");
            return $http.get('http://127.0.0.1:3000/event/getOnceEventDetails/' + eventId);
        },

        delete : function(id){
        	console.log("delete service");
        	return $http.get('http://127.0.0.1:3000/event/cancel/'+ id);

        },

        edit : function(formData,id){
        	console.log("edit service"+formData);

          if(formData.starttime && formData.endtime) {
            var starthour = formData.starttime.getHours()+"";
            if(starthour.length == 1) starthour = "0" + starthour;

            var endhour = formData.endtime.getHours()+"";
            if(endhour.length == 1) endhour = "0" + endhour;

            var startminute = formData.starttime.getMinutes()+"";
            if(startminute.length == 1) startminute = "0" + startminute;

            var endminute = formData.endtime.getMinutes()+"";
            if(endminute.length == 1) endminute = "0" + endminute;

            formData.timing = starthour+":"+startminute+"-"+endhour+":"+endminute;
          }

        	return $http.post('http://127.0.0.1:3000/event/edit/'+id, formData);
        },

        deleteImage : function(eventId, image) {
          console.log('delete image event service');
          console.log(eventId);
          console.log(image);
          return $http.get('http://127.0.0.1:3000/event/deleteImage/' + eventId + "/" + image);
        },

        addImage : function(eventId, formData) {
          var fd = new FormData();
          for(var key in formData)
            fd.append(key, formData[key]);

          console.log(fd);
          return $http.post('http://127.0.0.1:3000/event/addImage/' + eventId, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
          });
        }
  }
}]);
