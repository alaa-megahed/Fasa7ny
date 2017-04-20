angular.module('fasa7ny').controller('webAdminController', function($scope,$http,$modal)
	{  


   $scope.requests = [];

    $http.get('http://127.0.0.1:3000/admin/viewRequestedDelete').then(function(response){
      console.log(response.data);
            $scope.requests = response.data;
      });


//     // $scope.addBusiness = function()
//     //      {
//     //           console.log("da5al f add business");
//     //           console.log($scope.business);
//     //          $http.post('http://127.0.0.1:3000/admin/add_business', $scope.business)
//     //          .then(function(response)
//     //          {
//     //            console.log($scope.business);
//     //          });
//              // , 
//              // function(failureResponse)
//              //    {
      
//              //    });
// }
//     $scope.addAds = function()
//     {
//       $http.post('http://127.0.0.1:3000/admin/createAdvertisement',$scope.advertisement).then(function(response)
//       {
// console.log($scope.advertisement);
//       }, function(failureResponse){})
//     }


   
  $scope.addAdspop = function(){
             console.log("da5al pop");
             var modalInstance = $modal.open({
                templateUrl: 'views/addAdvertisement.html',
                controller: addAdsCtrl,
                scope : $scope
            })
   }

   $scope.addBusinesspop = function()
  {

             console.log("da5al pop");
             var modalInstance = $modal.open({
                templateUrl: 'views/addBusiness.html',
                controller: addBusinessCtrl,
              //   scope : $scope,
              //   resolve: { 
              //     business: function(){
              //       return $scope.business ;
              //   }
              // }
            })
   };

 var addAdsCtrl = function ($scope, $modalInstance,$route) 
  {
  $scope.advertisement = {};
      
       $scope.addAds = function()
         {
              $http.post('http://127.0.0.1:3000/admin/createAdvertisement',$scope.advertisement).then(function(response)
      {
       console.log($scope.advertisement);
      }, function(failureResponse){})
           $route.reload();
          $modalInstance.close('closed');
         };

         $scope.cancel = function()
        {
          $modalInstance.dismiss("cancel");
        };
   };



  $scope.deleteBusiness = function (request){
    $http.get("http://127.0.0.1:3000/admin/deleteBusiness/"+ request._id)
        
  }



 

  var addBusinessCtrl = function ($scope, $modalInstance,$route) 
  {
     $scope.business = {};
       console.log("da5al controller");
       $scope.addBusiness = function()
         {
              console.log("da5al f add business");
              console.log($scope.business);
             $http.post('http://127.0.0.1:3000/admin/add_business', $scope.business)
             .then(function(response)
             {
               console.log($scope.business);
             });
             // , 
             // function(failureResponse)
             //    {
      
             //    });
           $route.reload();
          $modalInstance.close('closed');
         };

         $scope.cancel = function()
        {
          $modalInstance.dismiss("cancel");
        };
   };

    //     $scope.no = function () {
    //         $modalInstance.dismiss('cancel');
    //     };
    });
