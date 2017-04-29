app.factory('viewOccurences', ['$http', 'IP', function($http, IP) {
  return {
    get : function(eventId) {
      console.log(eventId+" service");
      return $http.get('http://'+ IP.address + ':3000/event/viewO/' + eventId);
    },

    delete : function(occId) {
      console.log("delete service event occ");
      return $http.get('http://'+ IP.address + ':3000/event/cancelO/'+ occId);
    }
  }
}]);
