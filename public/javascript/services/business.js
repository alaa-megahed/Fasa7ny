app - ngular.module('businessService', [])

    .factory('Business', function($http) {
        return {
            getBusiness : function() {
              console.log("business1");
                return $http.get('/business/info/business1');
            },
          subscribe : functio(id) {
            return $http.get('/user/subscribe' + id);
          }
        }
    })
