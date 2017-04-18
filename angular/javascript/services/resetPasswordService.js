angular.module('fasa7ny')
.factory('resetPassword', function($http) {
  return {
    reset: function(id) {
      return $http.get('/auth/reset/:' + id);
    }
  }



})
