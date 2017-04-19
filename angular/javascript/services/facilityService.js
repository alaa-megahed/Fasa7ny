app.factory('Facility', ['$http', function($http) {
  return {
    createFacility : function(data) {
      var fd = new FormData();
      for(var key in data)
        fd.append(key, data[key]);

      console.log(fd);
      return $http.post('http://127.0.0.1:3000/event/createFacility', fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    },

    editFacility : function(facilityId, data) {
      console.log("edit facility service");
      var fd = new FormData();
      for(var key in data)
      {
        console.log(data[key]);
        fd.append(key, data[key]);
      }
      console.log(fd);
      return $http.post('http://127.0.0.1:3000/event/editFacility/' + facilityId, fd, {
        transformRequest: angular.identity,
        headers: { 'Content-Type': undefined }
      });
    },

    deleteFacility : function(facilityId) {
      console.log("delete facility service");

      return $http.get('http://127.0.0.1:3000/event/deleteFacility/' + facilityId);
    },

     addDaily : function(fid,description,capacity,name,formData){
          console.log("add daily service"+formData);
          formData.repeat = "Daily";
          formData.description = description;
          formData.capacity = capacity;
          formData.facility_id = fid;
          formData.name = name;
          formData.timing = formData.starttime.getHours()+":"+formData.starttime.getMinutes()+"-"+formData.endtime.getHours()+":"+formData.endtime.getMinutes();
          console.log("day:" + formData.day);
          console.log("Name:"+formData.name);
          return $http.post('http://127.0.0.1:3000/event/create', formData);
        }
  }
}]);
