angular.module('homepageService', [])

  .factory('Homepage', function($http) {
    return {
      get: function() {
        return $http.get('/');
      }
    }



  })
