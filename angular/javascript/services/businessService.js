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
            },

            deleteImage : function(image) {
              console.log('delete image service');
              return $http.get('http://127.0.0.1:3000/business/deleteImage/' + image);
            },

            addImage : function(data) {
              console.log('add image service');
              var fd = new FormData();
              for(var key in data)
                fd.append(key, data[key]);

              console.log(fd);
              return $http.post('http://127.0.0.1:3000/business/editInformation', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
              });
            }


            // checkSession : function(id) {
            //   console.log('check session service');
            //   return $http.get('http://127.0.0.1:3000/business/checkSession')
            // }
    	}
    }]);
