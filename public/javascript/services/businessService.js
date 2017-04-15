// angular.module('businessService', [])

    app.factory('Business', ['$http', function($http) {
        return {
            get : function() {
                return $http.get('/business/b');
            },

            edit : function(formData) {
            	console.log("service!");
            	return $http.post('/business/editInformation', formData);
            },

            subscribe : function(id) {
            	console.log("sub service");
            	return $http.get('/user/subscribe/' + id);
            },

            unsubscribe : function(id) {
            	console.log("unsub service");
            	return $http.get('/user/unsubscribe/' + id);
            },

            rate : function(star) {
              console.log("rate service");
              return $http.get('/user/rate/' + star);
            }
    	}
    }]);
