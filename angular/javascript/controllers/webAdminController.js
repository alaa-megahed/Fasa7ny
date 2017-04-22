angular.module('fasa7ny').controller('webAdminController', function($scope,$http,$modal,$route)
	{  

    $scope.ads = [];
    $scope.requests = [];
   

    $http.get('http://127.0.0.1:3000/admin/viewRequestedDelete').then(function successCallback(response){
   
            $scope.requests = response.data;
            });




    $http.get('http://127.0.0.1:3000/admin/viewAdvertisements').then(function successCallback(response){
             console.log(response.data);
            $scope.ads = response.data;
          console.log($scope.ads);
      });


       $scope.addBusiness = function()
         {
              console.log("da5al f add business");
              console.log($scope.business);
             $http.post('http://127.0.0.1:3000/admin/add_business', $scope.business)
             .then(function(response)
             {
               console.log($scope.business);
             });
             $route.reload();
          
         };


       $scope.addAds = function()
         {
          var fd = new FormData();
      for(var key in $scope.advertisement)
        fd.append(key, $scope.advertisement[key]);
      
              $http.post('http://127.0.0.1:3000/admin/createAdvertisement',fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type':undefined }
              }).then(function(response)
      {
       console.log($scope.advertisement);
      }, function(failureResponse){})
       
  };



 




  $scope.deleteBusiness = function (request)
  {
    if (confirm('Are you sure you want to delete this?'))
     {
    $http.get("http://127.0.0.1:3000/admin/deleteBusiness/"+ request._id)
       $route.reload();
    }
     
  }


  $scope.deleteAd = function(ad)
  {
    if (confirm('Are you sure you want to delete this?')) {
    $http.get("http://127.0.0.1:3000/admin/deleteAdvertisement/"+ ad._id)
       $route.reload();
  }

  }
 

 

    });
