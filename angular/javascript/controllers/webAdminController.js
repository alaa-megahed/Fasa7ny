angular.module('fasa7ny').controller('webAdminController', function($scope,$http,$modal,$route )
	{  
     // status.local()
     // .then(function(res){
     //   if(res.data){
     //     if(res.data.user_type == 3)    // admin
     //       $scope.type = 3;   // authorized as admin, anything else not admin, show "not authorized" message
     //   }
     // });
    $scope.ads = [];
    $scope.requests = [];
    $scope.msg = "";
   

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
       
             $http.post('http://127.0.0.1:3000/admin/add_business', $scope.business)
             .then(function(response)
             {
                $scope.msg = response.data;
                $scope.business = {};
             });
        
          
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
            $scope.msg = response.data;
           $scope.advertisement = {};

      })
       
  };



 




  $scope.deleteBusiness = function (request)
  {
    if (confirm('Are you sure you want to delete this?'))
     {
    $http.get("http://127.0.0.1:3000/admin/deleteBusiness/"+ request._id).then(function(response){
       $route.reload();
    }, 
     function(response){
      $scope.msg = response.data;
     }
    );
      
    }
     
  }


  $scope.deleteAd = function(ad)
  {
    if (confirm('Are you sure you want to delete this?')) {
    $http.get("http://127.0.0.1:3000/admin/deleteAdvertisement/"+ ad._id).then(function(response){
       $route.reload();
    }, 
     function(response){
      $scope.msg = response.data;
     }
    )
  }

  }
 

 

    });
