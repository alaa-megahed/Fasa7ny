// angular.module('businessService', [])

    app.factory('Business', ['$http', function($http) {
        return {
            get : function(id) {
                return $http.get('/business/b/' + id);
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

             rate : function(star, bid) {
              console.log("rate service");
              return $http.get('/user/rate/' + star+"/" + bid);
            },

            public : function(){
            	console.log('public service');
            	return $http.get('/business/publicPage');
            },

            remove : function(){
            	console.log('remove service');
            	return $http.get('/business/requestRemoval');
            }
    	}
    }]);
