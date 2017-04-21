var app = angular.module('fasa7ny');
app.service('Global', ['$http' , '$q', function($http, $q)
{
        var local = function()
        {
            return $http({
               url: 'http://127.0.0.1:3000/loggedin',
               method: "GET",
               withCredentials: true,
               headers: {
                           'Content-Type': 'application/json'
               }
             });
       };
       var foreign = function()
       {
            return $http.get('http://localhost:3000/loggedin');
       };
       this.getUser = function()
       {
            var user = undefined;
            local().then(
                function (result)
                {
                    if(!result.date)
                    {
                        var deferred = $q.defer();
                        foreign().then(
                            function(result)
                            {
                                if(result.data)
                                    return user = result.data;
                                else
                                    return user;
                            });
                    }
                    else
                    {
                        return user = result.data;
                    }
                });
            // return user;
       }

        // status.local().then(
     //  function(result)
     //       {
     //         $scope.user = result;
     //         console.log("Data is " + JSON.stringify(result));
     //         if($scope.user.data)
     //         {
     //            //This is your info
     //          }
     //          if(!$scope.user.data)
     //          {
     //            var deferred = $q.defer();
     //            status.foreign().then(function(result){
     //              $scope.user = result;
     //              if($scope.user.data)
     //              {
     //                //This is your info
     //               }
     //              deferred.resolve(result);
     //             console.log("response is " + JSON.stringify(deferred.promise));
     //            },function(response){
     //              deferred.reject();
     //              $location.path('/');
     //            });
     //          }
     //       });
}]);
