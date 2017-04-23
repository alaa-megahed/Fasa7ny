app.factory('OneTimeEvent', ['$http', function($http) {
    return {
        create : function(formData) {

          var starthour = formData.starttime.getHours()+"";
          if(starthour.length == 1) starthour = "0" + starthour;

          var endhour = formData.endtime.getHours()+"";
          if(endhour.length == 1) endhour = "0" + endhour;

          var startminute = formData.starttime.getMinutes()+"";
          if(startminute.length == 1) startminute = "0" + startminute;

          var endminute = formData.endtime.getMinutes()+"";
          if(endminute.length == 1) endminute = "0" + endminute;

          formData.timing = starthour+":"+startminute+"-"+endhour+":"+endminute;

          console.log("!!" + formData.timing);
          formData.repeat = "Once";
          console.log(formData);
            return $http.post('http://127.0.0.1:3000/event/create', formData);
        }
  }
}]);
