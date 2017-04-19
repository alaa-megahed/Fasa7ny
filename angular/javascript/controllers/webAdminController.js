angular.module('fasa7ny').controller('webAdminController', function($scope,$http)
	{   $scope.requests = [];

    $http.get('http://127.0.0.1:3000/admin/viewRequestedDelete').then(function(response){
            $scope.requests = response.data;
      })

    $scope.addAds = function()
    {
      $http.post('http://127.0.0.1:3000/admin/createAdvertisement',$scope.advertisement).then(function(response)
      {
console.log($scope.advertisement);
      }, function(failureResponse){})
    }


   $scope.addBusiness = function()
   {
     $http.post('http://127.0.0.1:3000/admin/add_business', $scope.business).then(function(response){
     	console.log($scope.business);
     }, function(failureResponse)
     {
     	
     })
   }


  $scope.deleteBusiness = function (){
        
  }
	});