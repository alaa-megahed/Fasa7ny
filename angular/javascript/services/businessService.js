// angular.module('businessService', [])
var app = angular.module('fasa7ny');
    app.factory('Business', ['$http', function($http) {
        return {
            get : function(id) {
              console.log("service");
                return $http.get('http://54.187.92.64:3000/business/b/' + id);
            },
            getUnloggedBusiness : function(id) {
                return $http.get('http://54.187.92.64:3000/business/getUnloggedBusiness/' + id);
            },
            edit : function(data) {

              var fd = new FormData();
              for(var key in data)
              fd.append(key, data[key]);

              console.log(fd);
              return $http.post('http://54.187.92.64:3000/business/editInformation', fd, {
              transformRequest: angular.identity,
              headers: { 'Content-Type': undefined }
              });
            },
            editLocation :function(data) {
              return $http.post('http://54.187.92.64:3000/business/editInformation', data);
            },

            subscribe : function(id) {
            	console.log("sub service");
            	return $http.get('http://54.187.92.64:3000/user/subscribe/' + id);
            },

            unsubscribe : function(id) {
            	console.log("unsub service");
            	return $http.get('http://54.187.92.64:3000/user/unsubscribe/' + id);
            },

             rate : function(star, bid) {
              console.log("rate service");
              return $http.get('http://54.187.92.64:3000/user/rate/' + star+"/" + bid);
            },

            public : function(){
            	console.log('public service');
            	return $http.get('http://54.187.92.64:3000/business/publicPage');
            },

            remove : function(){
            	console.log('remove service');
            	return $http.get('http://54.187.92.64:3000/business/requestRemoval');
            },

            hasBookings : function(){
              return $http.get('http://54.187.92.64:3000/business/hasBookings');
            },

            deleteImage : function(image) {
              console.log('delete image service');
              return $http.get('http://54.187.92.64:3000/business/deleteImage/' + image);
            },

            addImage : function(data) { //for slider
              console.log('add image service');
              var fd = new FormData();
              for(var key in data)
                fd.append(key, data[key]);

              console.log(fd);
              return $http.post('http://54.187.92.64:3000/business/changeImage', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
              });
            },

            deletePhone : function(phone) {
              console.log('delete phone service');
              console.log(phone);
              return $http.get('http://54.187.92.64:3000/business/deletePhone/' + phone);
            },

            deletePaymentMethod : function(method) {
              console.log('delete payment method service');
              console.log(method);
              return $http.get('http://54.187.92.64:3000/business/deletePaymentMethod/' + method);
            },

            changeImage : function(formData) {
              var fd = new FormData();
              for(var key in formData)
                fd.append(key, formData[key]);

              console.log(fd);
              return $http.post('http://54.187.92.64:3000/business/changeProfilePicture', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
              });
            },

            getFacilityOccs: function(facility_id){
              return $http.get('http://54.187.92.64:3000/business/getFacilityOccs/' + facility_id);
            },

            getEventOccs: function(event_id){
              return $http.get('http://54.187.92.64:3000/business/getEventOccs/' + event_id);
            },

            getBooking: function(booking_id){
              return $http.get('http://54.187.92.64:3000/business/getBooking/' + booking_id);
            },

            // checkSession : function(id) {
            //   console.log('check session service');
            //   return $http.get('http://54.187.92.64:3000/business/checkSession')
            // }
    	}
    }]);


    app.factory('business', function() {
      return {};
    });
