angular.module('userService',[])

    .factory('User', function($http) {
      return {
        get : function(id) {
          return $http.get('/user/subscribe/' + id);
        }
      }
    })
