app.factory('Schedule', ['$http', function($http) {
    return {
        get : function(name) {
          console.log("!!");
          console.log(name);
            return $http.get('http://54.187.92.64:3000/event/view/' + name);
        }
  }
}]);
