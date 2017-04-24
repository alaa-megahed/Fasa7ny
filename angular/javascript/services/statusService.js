angular.module('fasa7ny')
.factory('status', function($http) {
  return {
    local: function() {
    return $http({
       url: 'http://54.187.92.64:3000/loggedin',
       method: "GET",
       withCredentials: true,
       headers: {
                   'Content-Type': 'application/json'
       }
     });
   },
   foreign: function() {
     return $http.get('http://54.187.92.64:3000/loggedin',  { headers: {'Content-Type': 'application/json'} });
   }

  }



})
