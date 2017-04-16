app.factory('Event', ['$http', function($http) {
    return {
        get : function(businessId, eventId) {
          console.log(businessId);
          console.log(eventId);
          console.log("!!");
            return $http.get('http://127.0.0.1:3000/event/getOnceEventDetails/' + businessId + '/' + eventId);
        }
  }
}]);
