app.factory('Schedule', ['$http', function($http) {
    return {
        get : function(name) {
          console.log("!!");
          console.log(name);
            return $http.get('http://127.0.0.1:3000/event/view/' + name);
        }
  }
}]);
