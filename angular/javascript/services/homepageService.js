angular.module('fasa7ny')

  .factory('Homepage', function($http) {
    return {
      get: function() {
        return $http.get('http://127.0.0.1:3000/');
      },
  

      signUp : function(formData) {
        return $http.post('http://127.0.0.1:3000/auth/signup', formData);
      },
      forgotPassword : function(formData) {
        return $http.post('http://127.0.0.1:3000/auth/forgot', formData);
      },
      search : function(formData) {
        return $http.post('http://127.0.0.1:3000/search', formData);

      },
      resetUnread : function() {
        return  $http.get('http://127.0.0.1:3000/user/resetUnread');
      },
      check: function() {
        return $http.get('http://localhost:3000/loggedin');
      }


    }
  })
