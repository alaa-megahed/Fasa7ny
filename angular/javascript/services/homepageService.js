angular.module('fasa7ny')

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
      forgotPassword : function(formData) {
        return $http.post('auth/forgot', formData);
      },
      search : function(formData) {
        return $http.post('/search', formData);

      },
      resetUnread : function() {
        return  $http.get('/user/resetUnread');
      }


    }
  })


  .factory('LoggedIn', function($http) {
    return {
      check: function() {
        return $http.get('/loggedin');
      }
    }



  })
