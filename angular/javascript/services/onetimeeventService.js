var app = angular.module('fasa7ny');

app.factory('OneTimeEvent', ['$http', function($http) {
    return {
        create : function(formData) {
          
          console.log("!!");
          formData.repeat = "Once";
          console.log(formData);
            return $http.post('http://127.0.0.1:3000/event/create', formData);
        },

        getOnceEvents : function(businessId)
        {
        	return $http.get('http://127.0.0.1:3000/event/getOnceEvents/'+businessId);
        }
  }
}]);
