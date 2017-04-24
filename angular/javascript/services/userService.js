app.factory('User', ['$http', function($http) {
    return {
	    getUserDetails : function(id) {
	        return $http.get('http://127.0.0.1:3000/user/u/' + id);
	    },

	    getBookingDetails: function(booking) {
	        return $http.get('http://127.0.0.1:3000/user/bookings/' + booking);
	    },

	    getSubscribedBusiness: function(business_id) {
	        return $http.get('http://127.0.0.1:3000/user/subs/' + business_id);
	    },

	    editUserInfo: function(userID, formData) {

	    	var fd = new FormData();
              for(var key in formData)
                fd.append(key, formData[key]);

              console.log(fd);


	    	return $http.post('http://127.0.0.1:3000/user/editInfo/' + userID, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
              });
	    },

	    changeImage: function(userID, formData) {
	    	var fd = new FormData();
              for(var key in formData)
                fd.append(key, formData[key]);

            console.log("change image service");
            console.log(fd);

	    	return $http.post('http://127.0.0.1:3000/user/editInfo/' + userID, fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
              });
	    }
    }

}]);
