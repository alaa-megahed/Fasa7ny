// angular.module('businessService', [])

    app.factory('Business', ['$http', function($http) {
        return {
            get : function(id) {
                return $http.get('http://127.0.0.1:3000/business/b/' + id);
            },

            edit : function(formData) {
            	console.log("service!");
            	return $http.post('http://127.0.0.1:3000/business/editInformation', formData);
            },

            subscribe : function(id) {
            	console.log("sub service");
            	return $http.get('http://127.0.0.1:3000/user/subscribe/' + id);
            },

            unsubscribe : function(id) {
            	console.log("unsub service");
            	return $http.get('http://127.0.0.1:3000/user/unsubscribe/' + id);
            },

             rate : function(star, bid) {
              console.log("rate service");
              return $http.get('http://127.0.0.1:3000/user/rate/' + star+"/" + bid);
            },

            public : function(){
            	console.log('public service');
            	return $http.get('http://127.0.0.1:3000/business/publicPage');
            },

            remove : function(){
            	console.log('remove service');
            	return $http.get('http://127.0.0.1:3000/business/requestRemoval');
            }
    	}
    }]);
