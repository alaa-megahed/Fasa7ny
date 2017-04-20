app.factory('OneTimeEvent', ['$http', function($http) {
    return {
        create : function(formData) {

          formData.timing = formData.starttime.getHours()+":"+formData.starttime.getMinutes()+"-"+formData.endtime.getHours()+":"+formData.endtime.getMinutes();
          console.log("!!" + formData.timing);
          formData.repeat = "Once";
          console.log(formData);
            return $http.post('http://127.0.0.1:3000/event/create', formData);
        }
  }
}]);
