app.factory('Schedule', ['$http', function($http) {
    return {
        get : function() {
          console.log("!!");
            return $http.get('http://127.0.0.1:3000/event/view');
        }
  }
}]);
