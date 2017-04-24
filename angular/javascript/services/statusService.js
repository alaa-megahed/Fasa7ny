angular.module('fasa7ny')
.factory('status', function($http) {
  return {
    local: function() {
    return $http({
       url: 'http://127.0.0.1:3000/loggedin',
       method: "GET",
       withCredentials: true,
       headers: {
                   'Content-Type': 'application/json'
       }
     });
   },
   foreign: function() {
     return $http.get('http://localhost:3000/loggedin');
   }

  }



})
