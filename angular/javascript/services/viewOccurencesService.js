app.factory('viewOccurences', ['$http', function($http) {
  return {
    get : function(eventId) {
      console.log(eventId+" service");
      return $http.get('http://54.187.92.64:3000/event/viewO/' + eventId);
    },

    delete : function(occId) {
      console.log("delete service event occ");
      return $http.get('http://54.187.92.64:3000/event/cancelO/'+ occId);
    }
  }
}]);
