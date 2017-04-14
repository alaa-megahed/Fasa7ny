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
            }
    	}
    }]);
           
    // .factory('Edit',function($http){
    // 	return{
    // 		get : function(){
    //         	return $http.get('/business/editInformation');
    //         }
    // 	}
    // });
            
        
 