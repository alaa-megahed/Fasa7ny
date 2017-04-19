angular.module('fasa7ny')

  .factory('Homepage', function($http) {
    return {
      get: function() {
        return $http.get('http://127.0.0.1:3000/');
      },
      signIn : function(formData) {
        return $http({
         url: 'http://127.0.0.1:3000/auth/login',
         method: "POST",
         withCredentials: true,
         data: {username : formData.username, password :formData.password},
         headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
         },
         transformRequest: function(obj) {
             var str = [];
             for(var p in obj)
             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
             return str.join("&");
         }
       })
      },
      facebook: function(){
        return $http({
         url: 'http://127.0.0.1:3000/auth/facebook',
         method: "GET",
         withCredentials: true,
         headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
         },
         transformRequest: function(obj) {
             var str = [];
             for(var p in obj)
             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
             return str.join("&");
         }
       })
     },
     google: function(){
       $http({
        url: 'http://127.0.0.1:3000/auth/google',
        method: "GET",
        withCredentials: true,
        headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
        },
        transformRequest: function(obj) {
            var str = [];
            for(var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            return str.join("&");
          }
        })
      },
      signUp : function(formData) {
        return $http({
         url: 'http://127.0.0.1:3000/auth/signup',
         method: "POST",
         withCredentials: true,
         data: formData,
         headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
         },
         transformRequest: function(obj) {
             var str = [];
             for(var p in obj)
             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
             return str.join("&");
         }
       })
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
        return $http({
         url: 'http://127.0.0.1:3000/loggedin',
         method: "GET",
         withCredentials: true,
         headers: {
                     'Content-Type': 'application/x-www-form-urlencoded'
         },
         transformRequest: function(obj) {
             var str = [];
             for(var p in obj)
             str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
             return str.join("&");
         }
       })
      }


    }
  })
