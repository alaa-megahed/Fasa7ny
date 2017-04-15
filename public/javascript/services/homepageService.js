angular.module('homepageService', [])

  .factory('Homepage', function($http) {
    return {
      get: function() {
        return $http.get('/');
      },
      signIn : function(formData) {
        return $http.post('auth/login', formData);
      },
      signUp : function(formData) {
        return $http.post('auth/signup', formData);
      },
    }
  })


  .factory('LoggedIn', function($http) {
    return {
      check: function() {
        return $http.get('/loggedin');
      }
    }



  })
