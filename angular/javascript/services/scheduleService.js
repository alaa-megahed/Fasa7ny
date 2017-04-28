app.factory('Schedule', ['$http','IP', function($http, IP) {
    return {
        get : function(name) {
          console.log("!!");
          console.log(name);
            return $http.get('http://'+ IP.address + ':3000/event/view/' + name);
        }
  }
}]);
