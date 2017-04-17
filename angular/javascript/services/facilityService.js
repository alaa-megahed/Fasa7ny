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
    }
  }
}]);
