angular.module('fasa7ny')
.factory('resetPassword', function($http) {
  return {
    reset: function(token, formData) {
      return $http.post('http://54.187.92.64:3000/auth/reset/' + token, formData);
    }
  }



})
